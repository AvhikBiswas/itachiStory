document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const scrollContainer = document.getElementById('scroll-container');
    const context = canvas.getContext('2d');
    const frameCount = 809;
    const currentFrame = (index) => `./frames/frame_${String(index).padStart(4, '0')}.jpeg`;

    let images = [];
    let currentScrollPosition = 0;
    let ticking = false;

    // Text overlay data
    const textOverlays = [
        { frame: 100, text: "Itachi Uchiha: A Complex Character" },
        { frame: 250, text: "Master of Genjutsu" },
        { frame: 300, text: "Itachi's Sharingan Awakens" },
        { frame: 380, text: "The Night of the Uchiha Massacre" },
        { frame: 440, text: "Akatsuki Member: The Rogue Ninja" },
        { frame: 500, text: "The Truth Revealed: A Hidden Hero" },
        { frame: 800, text: "Itachi's Legacy Lives On" }
    ];

    // Set up canvas size
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    // Function to load a single image
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    // Function to load all images
    const loadAllImages = async () => {
        const imagePromises = [];
        for (let i = 1; i <= frameCount; i++) {
            imagePromises.push(loadImage(currentFrame(i)));
        }
        try {
            images = await Promise.all(imagePromises);
            console.log('All images loaded successfully');
            initializeAnimation();
        } catch (error) {
            console.error('Error loading images:', error);
        }
    };

    // Function to initialize the animation
    const initializeAnimation = () => {
        resizeCanvas();
        setScrollContainerHeight();
        window.scrollTo(0, 19 * (document.documentElement.scrollHeight / frameCount)); // Start at frame 19
        render(); // Initial render
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
    };

    // Set the height of the scroll container
    const setScrollContainerHeight = () => {
        scrollContainer.style.height = `${frameCount * 50}px`; // Reduced multiplier for faster scrolling
    };

    // Function to render the correct frame based on scroll
    const render = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = Math.max(0, Math.min(1, currentScrollPosition / scrollHeight));
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );

        if (Number.isInteger(frameIndex) && frameIndex >= 0 && frameIndex < images.length) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
            drawTextOverlay(frameIndex);
        } else {
            console.error(`Invalid frame index: ${frameIndex}`);
        }

        ticking = false;
    };

    // Function to draw text overlay
    const drawTextOverlay = (frameIndex) => {
        const overlay = textOverlays.reduce((prev, current) => 
            (Math.abs(current.frame - frameIndex) < Math.abs(prev.frame - frameIndex) ? current : prev)
        );

        context.font = 'bold 24px Arial';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.textAlign = 'center';
        context.textBaseline = 'bottom';

        const text = overlay.text;
        const x = canvas.width / 2;
        const y = canvas.height - 30;

        context.strokeText(text, x, y);
        context.fillText(text, x, y);
    };

    // Scroll event handler
    const handleScroll = () => {
        currentScrollPosition = window.pageYOffset;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                render();
                ticking = false;
            });
            ticking = true;
        }
    };

    // Resize event handler
    const handleResize = () => {
        resizeCanvas();
        setScrollContainerHeight();
        render();
    };

    // Start loading images
    loadAllImages();
});
