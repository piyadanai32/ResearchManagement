# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.0.26 as base

WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install

RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM install AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ARG PUBLIC_SUPABASE_KEY
ARG PUBLIC_SUPABASE_URL

# [optional] tests & build
ENV NODE_ENV=production
ENV PUBLIC_SUPABASE_KEY=$PUBLIC_SUPABASE_KEY
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL

RUN bun test
RUN bun --bun run vite build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build .

ARG PUBLIC_SUPABASE_KEY
ARG PUBLIC_SUPABASE_URL
ARG PORT=3000

ENV PUBLIC_SUPABASE_KEY=$PUBLIC_SUPABASE_KEY
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host
ENV PORT=$PORT

# run the app
USER bun
EXPOSE $PORT/tcp

ENTRYPOINT [ "bun", "--bun", "run", "index.js" ]
