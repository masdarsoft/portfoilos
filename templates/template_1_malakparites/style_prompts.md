Here is a comprehensive set of highly engineered prompts designed to be fed into your AI coding assistant or UI generator. These prompts are tailored for a modern stack (like Next.js and Tailwind CSS) and ensure native support for Right-to-Left (RTL) Arabic layouts while executing your specific glassmorphism, wave, and floating UI requirements for the newly rebranded **مؤسسة ملك الحفلات**.

### 1. The Design System & Color Palette Prompt

*Use this to generate the foundational theme, typography, and Tailwind configuration.*

> **Prompt:**
> "Act as a Senior UX/UI Designer and Frontend Architect. I am entirely redesigning an event rental platform, rebranding it to 'مؤسسة ملك الحفلات' (Party King Foundation). The design must feel luxurious, breathtaking, and entirely distinct from a standard e-commerce site.
> Please generate a complete design system with a regal, modern aesthetic. Provide:
> 1. A sophisticated color palette including a rich primary color (e.g., deep elegant shades like #5B2D4A or majestic teal #00869E) and a luxury accent (like gold #D4AF37). Provide exact HEX codes for background, foreground, primary, secondary, and muted UI elements.
> 2. Typography recommendations combining a highly professional Arabic font (e.g., Tajawal, Cairo, or Kufam) with a modern English sans-serif.
> 3. A `tailwind.config.js` file output that extends these colors and adds custom utilities for varying degrees of glassmorphism (e.g., `bg-white/10 backdrop-blur-md border-white/20`). Ensure the configuration natively supports RTL layout."
> 
> 

### 2. The Responsive Glassmorphism Navigation Prompt

*Use this to generate the dynamic navbar that shifts position and style based on device and scroll state.*

> **Prompt:**
> "Write a React component using Tailwind CSS for a highly dynamic, RTL-supported navigation bar for 'مؤسسة ملك الحفلات'. The requirements are strictly as follows:
> **Desktop Behavior (Screens `md:` and up):**
> * Starts as a transparent top navigation bar.
> * On scroll, it transitions into a floating, centered, pill-shaped navbar using a strong glassmorphism effect (backdrop blur, semi-transparent background, subtle light border).
> 
> 
> **Mobile Behavior (Screens below `md:`):**
> * The top navbar is completely hidden.
> * Instead, render a bottom fixed navigation bar (app-like experience) that hovers slightly above the bottom edge of the screen.
> * This bottom navbar must also utilize a premium glassmorphism effect, displaying icons for 'Home', 'Services', 'Cart/Booking', and 'Account'.
> 
> 
> Include the React `useEffect` hook logic to handle the scroll event listener cleanly. Ensure smooth CSS transitions between all states."

### 3. The Professional SVG Waves & Transitions Prompt

*Use this to break up standard boxy layouts and create fluid, modern section transitions.*

> **Prompt:**
> "Generate the React/Tailwind code for a Hero Section transitioning into a Services Section for 'مؤسسة ملك الحفلات'. I want to completely avoid flat, horizontal line breaks.
> 1. Design a majestic Hero Section featuring a large, bold Arabic headline with a modern subtitle.
> 2. At the bottom of the Hero Section, integrate a custom, multi-layered SVG wave divider that seamlessly bridges the hero background color to the services background color.
> 3. The waves should look professional, fluid, and subtle—not cartoonish. Use varying opacities of the primary brand color to create depth.
> 4. Below the wave, create a grid layout for the event services, using modern cards that feature subtle hover effects (e.g., slight lift and shadow increase) and soft border radii."
> 
> 

### 4. Unique UX Interactions & Floating Elements Prompt

*Use this to add the final layer of polish and micro-interactions that elevate the user experience.*

> **Prompt:**
> "Act as an expert in Frontend Micro-interactions. For an Arabic RTL web application ('مؤسسة ملك الحفلات'), provide the React and Tailwind code for three unique UI components that enhance the user experience:
> 1. **Floating Action Button (FAB) for WhatsApp:** A beautifully styled, glassmorphic button that pulses gently, fixed to the bottom-left of the screen (since it's RTL), allowing instant booking inquiries.
> 2. **Interactive Service Cards:** A card component where the image slightly zooms inside its container on hover, and a glassmorphic layer slides up from the bottom displaying the 'Quick Reservation' (حجز سريع) button.
> 3. **Animated Scroll Reveal:** Provide a custom Tailwind utility or a wrapper component using Framer Motion (or standard CSS keyframes) that fades and slides elements up softly as they enter the viewport during scrolling."
> 
> 

---

Would you like me to go ahead and write the actual Next.js/Tailwind code for that dynamic desktop-to-mobile glassmorphism navigation bar so you can drop it directly into your project?