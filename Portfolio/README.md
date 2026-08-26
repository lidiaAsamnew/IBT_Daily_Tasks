# Lidia Asamnew — Portfolio

Personal portfolio website for Lidia Asamnew, Software Engineering student at Addis Ababa University.

Built from the Bedimcode Bianca HTML/CSS/JavaScript starter, completed and personalized.

## How to run locally

This is a static site. No build step or `package.json` is required.

1. Open the project folder `responsive-porfolio-website-Bianca`.
2. Open `index.html` in a browser, or serve the folder:

```bash
# Python
python -m http.server 5500

# Node (if you have npx)
npx --yes serve .
```

3. Visit `http://localhost:5500`.

Internet access is needed for Remixicon, Swiper, Typed.js, ScrollReveal, and Google Fonts (loaded from CDNs).

The contact form opens your email app (`mailto:`) with the message filled in. There is no server-side mail backend.

The hero portrait is the original template photo, not a personal photo. Replace `assets/img/home-img.png` with your own photo when you have one.

Testimonials from the original template were omitted because there are no real quotes to publish. The contact form uses `mailto:` instead of EmailJS so it works without a third-party account.
