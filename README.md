# Unearth

A civic intelligence tool

## v2

The original implementation was a Vite + React frontend served from an Express backend in a monorepo. While functional, the dev setup had accumulated enough friction that iteration was slower than I'd like.

The MVP rewrite moves to Next.js primarily to reduce overhead as managing two services in parallel meant more time on infrastructure and less on the product itself. Collapsing the frontend and backend into a single project lets me move faster and focus on what I most care about: the UI and user experience. SSR is a secondary benefit, giving shareable analysis URLs proper metadata and HTML responses without additional configuration.

### things i fudged earlier or didnt need at the time of building

- [ ] update footer m/p to match page section spacing
- [ ] Update score calc
- [ ] Detect videos (and non article/post) and reject analysis (for now). major issue with tiktok videos being submitted..
- [ ] Websockets to stream analysis progress. two options: modal with timeline -> redirect once complete. or create analysis page before anything -> redirect user -> fill in data as is comes in.
- [ ] Remove articles from breaking news gallery if unprocessable (currently only disabling)
- [ ] Component loading skeletons
- [ ] analysis preview cards
- [ ] gallery wrapper for previews and breaking news?
- [ ] search and filters + sorting in discover page
- [ ] api calls in parallel when analyzing (currently sequential and taking up time SMH)
