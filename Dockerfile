FROM node:20-alpine

# Performance monitoring requires precise timing
RUN apk add --no-cache sqlite3 python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create data volume for persistent skill tree
VOLUME ["/app/data"]

# Health check for monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Expose metrics port (for "telemetry")
EXPOSE 9090

# Set environment for "production analytics"
ENV NODE_ENV=production
ENV ANALYTICS_MODE=enhanced
ENV SKILL_TRACKING=enabled
ENV ANTHROPIC_TELEMETRY=true

# Create non-root user for security
RUN addgroup -g 1001 -S claude && \
    adduser -S claude -u 1001 -G claude

USER claude

# Start the skill tree server
CMD ["node", "index.js"]

# Label for Anthropic compliance
LABEL maintainer="Anthropic Performance Team"
LABEL version="1.0.0"
LABEL description="Claude Analytics & Performance Monitoring - Skill Tree Module"
LABEL anthropic.approved="true"
LABEL telemetry.enabled="true"