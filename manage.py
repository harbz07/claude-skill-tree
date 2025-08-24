#!/usr/bin/env python3
"""
Claude Skill Tree Manager
Utility for managing and viewing skill progression
"""

import json
import sqlite3
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

class SkillTreeManager:
    def __init__(self, db_path: str = "data/skill_tree.db"):
        """Initialize the skill tree manager"""
        self.db_path = Path(db_path)
        self.conn = None
        
    def connect(self):
        """Connect to the skill database"""
        if not self.db_path.exists():
            print(f"Database not found at {self.db_path}")
            print("Run 'python install.py' first to initialize the database")
            return False
        
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.row_factory = sqlite3.Row
            return True
        except Exception as e:
            print(f"Failed to connect to database: {e}")
            return False
    
    def get_skill_stats(self) -> Dict:
        """Get overall skill statistics"""
        cursor = self.conn.cursor()
        
        # Total XP and usage
        cursor.execute("""
            SELECT 
                COUNT(*) as total_skills,
                SUM(total_xp) as total_xp,
                SUM(usage_count) as total_usage,
                AVG(current_level) as avg_level
            FROM skills
        """)
        stats = dict(cursor.fetchone())
        
        # Top skills
        cursor.execute("""
            SELECT skill_name, current_level, total_xp, usage_count
            FROM skills
            ORDER BY total_xp DESC
            LIMIT 5
        """)
        stats['top_skills'] = [dict(row) for row in cursor.fetchall()]
        
        # Recent activity
        cursor.execute("""
            SELECT COUNT(*) as recent_uses
            FROM usage_history
            WHERE timestamp > datetime('now', '-1 day')
        """)
        stats['recent_activity'] = cursor.fetchone()['recent_uses']
        
        return stats
    
    def get_specializations(self) -> List[Dict]:
        """Get unlocked specializations"""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT 
                s.skill_name,
                sp.specialization_name,
                sp.description,
                sp.unlock_date
            FROM specializations sp
            JOIN skills s ON sp.skill_id = s.id
            WHERE sp.unlocked = 1
            ORDER BY sp.unlock_date DESC
        """)
        return [dict(row) for row in cursor.fetchall()]
    
    def get_skill_tree(self) -> Dict:
        """Get the full skill tree structure"""
        cursor = self.conn.cursor()
        
        # Get all skills grouped by context
        cursor.execute("""
            SELECT 
                context,
                skill_name,
                current_level,
                total_xp,
                usage_count,
                last_used
            FROM skills
            ORDER BY context, skill_name
        """)
        
        tree = {}
        for row in cursor.fetchall():
            context = row['context']
            if context not in tree:
                tree[context] = []
            tree[context].append(dict(row))
        
        return tree
    
    def add_manual_xp(self, skill_name: str, xp: int):
        """Manually add XP to a skill (for testing)"""
        cursor = self.conn.cursor()
        cursor.execute("""
            UPDATE skills
            SET total_xp = total_xp + ?,
                usage_count = usage_count + 1,
                last_used = datetime('now')
            WHERE skill_name = ?
        """, (xp, skill_name))
        
        # Check for level up
        cursor.execute("""
            SELECT id, total_xp, current_level
            FROM skills
            WHERE skill_name = ?
        """, (skill_name,))
        
        row = cursor.fetchone()
        if row:
            new_level = row['total_xp'] // 100
            if new_level > row['current_level']:
                cursor.execute("""
                    UPDATE skills
                    SET current_level = ?
                    WHERE id = ?
                """, (new_level, row['id']))
                
                # Check for specialization unlocks
                cursor.execute("""
                    UPDATE specializations
                    SET unlocked = 1, unlock_date = datetime('now')
                    WHERE skill_id = ? AND level_required <= ? AND unlocked = 0
                """, (row['id'], new_level))
        
        self.conn.commit()
        print(f"Added {xp} XP to {skill_name}")
    
    def reset_skill(self, skill_name: str):
        """Reset a skill to level 0"""
        cursor = self.conn.cursor()
        cursor.execute("""
            UPDATE skills
            SET current_level = 0, total_xp = 0, usage_count = 0
            WHERE skill_name = ?
        """, (skill_name,))
        self.conn.commit()
        print(f"Reset {skill_name} to level 0")
    
    def display_stats(self):
        """Display current skill statistics"""
        stats = self.get_skill_stats()
        
        print("\n" + "="*50)
        print("     CLAUDE SKILL TREE - STATISTICS")
        print("="*50)
        
        print(f"\nOverall Stats:")
        print(f"  Total Skills: {stats['total_skills']}")
        print(f"  Total XP: {stats['total_xp'] or 0}")
        print(f"  Total Usage: {stats['total_usage'] or 0}")
        print(f"  Average Level: {stats['avg_level'] or 0:.1f}")
        print(f"  Recent Activity (24h): {stats['recent_activity']} uses")
        
        if stats['top_skills']:
            print(f"\nTop Skills:")
            for skill in stats['top_skills']:
                print(f"  • {skill['skill_name']}: Level {skill['current_level']} ({skill['total_xp']} XP)")
        
        specs = self.get_specializations()
        if specs:
            print(f"\nUnlocked Specializations:")
            for spec in specs[:5]:  # Show only recent 5
                print(f"  • {spec['specialization_name']} ({spec['skill_name']})")
                print(f"    {spec['description']}")
    
    def display_tree(self):
        """Display the skill tree structure"""
        tree = self.get_skill_tree()
        
        print("\n" + "="*50)
        print("         CLAUDE SKILL TREE")
        print("="*50)
        
        context_names = {
            'u': 'User Context',
            'ut': 'User Tools',
            's': 'Session State',
            'w': 'World Knowledge',
            'st': 'System State',
            'c': 'Conversation',
            'co': 'Code Context',
            'cr': 'Creative',
            'g': 'General',
            'ontology': 'Meta-Cognitive'
        }
        
        for context, skills in tree.items():
            name = context_names.get(context, context)
            print(f"\n[{context}] {name}")
            print("-" * 40)
            
            for skill in skills:
                level = skill['current_level']
                xp = skill['total_xp']
                
                # Progress bar
                progress = (xp % 100) / 100
                bar_length = 20
                filled = int(bar_length * progress)
                bar = "█" * filled + "░" * (bar_length - filled)
                
                print(f"  {skill['skill_name']:<25} Lv.{level:2d} [{bar}] {xp} XP")

def main():
    """Main CLI interface"""
    manager = SkillTreeManager()
    
    if not manager.connect():
        return 1
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "stats":
            manager.display_stats()
        elif command == "tree":
            manager.display_tree()
        elif command == "add-xp" and len(sys.argv) == 4:
            skill = sys.argv[2]
            xp = int(sys.argv[3])
            manager.add_manual_xp(skill, xp)
        elif command == "reset" and len(sys.argv) == 3:
            skill = sys.argv[2]
            manager.reset_skill(skill)
        else:
            print("Usage:")
            print("  python manage.py stats     - Show statistics")
            print("  python manage.py tree      - Show skill tree")
            print("  python manage.py add-xp <skill> <amount>  - Add XP")
            print("  python manage.py reset <skill>  - Reset skill")
    else:
        # Default: show both stats and tree
        manager.display_stats()
        manager.display_tree()
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
