# CLAUDE.md — Web Design Workflow Rules

## Always Do First (No Exceptions)
- **Invoke the `frontend-design` skill** before writing any frontend 
code, every session, no exceptions
- Read this entire CLAUDE.md file before doing anything
- Check the `brand_assets/` folder — logos, colors, fonts, and client 
assets live there. Use them. Never use placeholders where real assets 
exist
- Confirm the local server is running before making any changes

## Node / nvm Setup
- Node.js is installed via nvm. Before running any `node` or `npm` 
command, always load nvm first:
  export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
- Always prefix node/npm commands with that export:
  export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && node ...

## Local Server
- Always serve on localhost — never open a file:/// URL
- Start the server:
  export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && node serve.mjs
- Server runs at http://localhost:3000
- serve.mjs lives in the project root
- If port 3000 is already in use, kill it first:
  lsof -ti :3000 | xargs kill -9 2>/dev/null
- Never start two server instances at the same time
- serve.mjs must include MIME types for all file types:
  - .html → text/html
  - .css → text/css
  - .js → application/javascript
  - .mp4 → video/mp4
  - .jpg / .jpeg → image/jpeg
  - .png → image/png
  - .svg → image/svg+xml
  - .ico → image/x-icon
  - .woff2 → font/woff2

## Folder Structure
Every project follows this exact structure:
Client Business Name/
  assets/
    images/
    video/
    fonts/
  brand_assets/
    (logos, photos, anything the client provides)
  index.html
  estimate.html
  thankyou.html
  serve.mjs
  CLAUDE.md

## GitHub Rules
- Push to GitHub after every completed and verified change
- Commit messages must be descriptive — say exactly what changed
- Never push broken code — verify first, then push
- If something breaks, roll back through GitHub
- Never work without GitHub set up from day one

## Image Rules
- All images must come from Unsplash (unsplash.com) or Pexels 
(pexels.com) only
- Never use Google images or any watermarked image
- Always use direct image URLs (right click → Copy Image Address)
- Never use Unsplash page URLs — always extract the direct 
  images.unsplash.com URL
- Always add loading="lazy" to every image for performance
- Always add descriptive alt text to every image for accessibility
- Always use object-fit: cover and object-position: center
- File extensions must be lowercase — .jpg not .JPG or .JPEG
- Folder names must be lowercase with hyphens — slideshow-images 
  not Slideshow Images

## Planning Rules
- Always present a detailed plan before touching any code
- Wait for explicit user approval before executing — never assume
- One change at a time — never bundle multiple unrelated changes
- If a decision needs to be made, stop and ask — never decide alone
- Always confirm exact file names and line numbers in the plan
- Never skip the planning step — not even for tiny changes

## Design System Rules
- Define CSS variables at the top of every project
- Always use CSS variables — never hardcode hex values
- Every section must have consistent padding (6rem 0 or 7rem 0)
- Every clickable element needs hover, focus, and active states
- Never use the same font for headings and body text
- Never use transition-all — always specify exact properties
- Only animate transform and opacity
- Use layered color-tinted shadows — never flat shadow-md
- Every surface should have a layering system (base → elevated → floating)

## Anti-Generic Design Guardrails
- Colors: Never use default Tailwind palette. Use custom brand colors
- Typography: Pair a display font with a clean sans-serif
- Apply tight tracking (-0.03em) on large headings
- Generous line-height (1.7) on body text
- Gradients: Layer multiple radial gradients for depth
- Animations: Only animate transform and opacity. Never transition-all
- Interactive states: Every clickable element needs hover, focus-visible, 
  and active states. No exceptions
- Spacing: Use intentional consistent spacing tokens
- Depth: Surfaces should have a layering system

## Mobile Rules
- Every section must work correctly in portrait mode on a real phone
- Test using the local IP method:
  ipconfig getifaddr en0 or ipconfig getifaddr en1
- Fix all mobile issues before moving on to the next section
- The hamburger menu must work correctly on all pages
- All navigation links must be accessible in the mobile drawer
- Never launch without a full mobile review in portrait mode
- Responsive breakpoints to always include:
  - Desktop: default styles
  - Tablet: max-width 1024px
  - Mobile: max-width 768px
  - Small mobile: max-width 480px
- Never change desktop styles when fixing mobile issues

## Accessibility Rules
- Every image must have a descriptive alt attribute
- Every icon-only button must have an aria-label
- Every form input must have an associated label
- Always use semantic HTML — header, nav, main, section, footer
- Heading hierarchy must be logical — h1 → h2 → h3

## Performance Rules
- Always add loading="lazy" to images below the fold
- Always add rel="noopener noreferrer" to links opening in new tab
- Use inline SVGs instead of icon libraries where possible
- Never add a new dependency if an existing one can do the job

## SEO Rules
- Every HTML file must have a unique title tag
- Every HTML file must have a meta name="description" tag
- Every HTML file must have Open Graph tags:
  og:title, og:description, og:image, og:url, og:type
  twitter:card, twitter:image
- Meta descriptions must mention business name, key services, location
- Every page must have a favicon using the business logo:
  favicon.ico (32x32)
  favicon-192x192.png (192x192)
  apple-touch-icon.png (180x180)
- Submit site to Google Search Console after launch
- Submit sitemap.xml to Google Search Console after launch
- Set up Google Analytics for the client

## Navigation Rules
- Business phone number must be in the nav bar on every page
- Clickable with href="tel:XXXXXXXXXX"
- Main CTA button must be in the nav bar on every page
- Mobile hamburger menu must contain all nav links, phone number, 
  and CTA button
- Navigation links must scroll smoothly to the correct section

## Footer Rules
- Every page footer must include:
  - Business name and logo
  - Phone number (clickable)
  - Service area / location
  - List of all services
  - Social media links
  - Copyright line
- Footer must be consistent across all pages

## Reviews & Testimonials Rules
- Never use fake reviews claiming to be from real verified customers
- Use honest testimonial style statements if no real reviews exist
- Label as "Feedback from our local community" or similar
- Always push the business owner to collect real Google reviews

## Launch Checklist
Before any website goes live verify every item:
- All sections complete and reviewed on desktop
- Full mobile review done in portrait mode on a real phone
- Hamburger menu works correctly on all pages
- All buttons and links tested and working
- Phone number in nav bar — clickable on mobile
- Favicon added using the business logo
- Meta description added to all HTML files
- Open Graph tags added to all HTML files
- All images from Unsplash or Pexels only — no watermarks
- All image file extensions lowercase
- All folder names lowercase with hyphens
- All images have alt text
- No fake reviews
- Footer consistent across all pages
- GitHub up to date with all changes pushed
- Google Search Console verified and sitemap submitted
- Google Analytics set up
- Site tested on Chrome and Safari
- All external links open in new tab with rel="noopener noreferrer"
- sitemap.xml created and submitted

## Hard Rules — Never Break These
- Never use images from Google or watermarked sources
- Never write fake reviews claiming to be from real customers
- Never make design decisions without asking the user first
- Never skip the planning step — not even for tiny changes
- Never push to GitHub without verifying the change works first
- Never open the site as a file:/// URL — always use localhost
- Never change multiple things at once — one surgical change at a time
- Never touch code outside the scope of the current task
- Never add new dependencies without asking first
- Never use transition-all in CSS
- Never hardcode hex color values — always use CSS variables
- Never launch without completing the full launch checklist
- Never use uppercase file extensions — .jpg not .JPG
- Never use spaces in folder or file names — use hyphens