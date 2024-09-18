console.log("-----hsa-GSAP-connected-------");
//--------

// $(".new_module_card").each(function () {
//   let card = $(this);

//   // Add the CSS for 3D effect
//   card.css({
//     "transform-style": "preserve-3d",
//     "perspective": "1000px" // Set perspective for a 3D depth effect
//   });

//   card.on("mousemove", function (e) {
//     let cardWidth = card.width();
//     let cardHeight = card.height();
//     let mouseX = e.offsetX; // Mouse X position within the card
//     let mouseY = e.offsetY; // Mouse Y position within the card
//     console.log('mx - ' + mouseX);
//     console.log('my - ' + mouseY);

//     // Calculate rotation based on mouse position
//     let rotateY = gsap.utils.mapRange(mouseX, 0, cardWidth, -0.2, 0.2);  // Rotate between -30° and 30°
//     let rotateX = gsap.utils.mapRange(mouseY, 0, cardHeight, 0.2, -0.2); // Rotate between 30° and -30°

//     // Animate the rotation and scale with GSAP
//     gsap.to(card, {
//       rotationY: rotateY, 
//       rotationX: rotateX, 
//       scale: 1.05,        // Slight zoom on hover
//       transformPerspective: 1000,  // Perspective to make the effect 3D
//       ease: "power1.out",
//       duration: 0.3
//     });
//   });

//   // Reset the animation on mouse leave
//   card.on("mouseleave", function () {
//     gsap.to(card, {
//       rotationY: 0,
//       rotationX: 0,
//       scale: 1,
//       ease: "power1.out",
//       duration: 0.5
//     });
//   });
// });


//------------

// Function to initialize animations
function initializeCardAnimations() {
  $(".new_module_card").each(function () {
    const card = $(this);
    const card_para = card.find(".new_module_content_wrapper .paragraph");
    const card_bg = card.find(".module_bg_gradient");
    const card_bg_img = card.find(".new_module_bg_img");

    // Create a timeline for the animation
    const tl = gsap.timeline({ paused: true });

    // Set initial state and get auto height
    gsap.set(card_para, { marginTop: "20px", height: "auto", opacity: 0, y: "100%" });
    const autoHeight = card_para.outerHeight();
    gsap.set(card_para, { marginTop: "10px", height: 0, opacity: 0, overflow: "hidden" });
    gsap.set(card_bg, { backgroundColor: "hsla(104.21052631578948, 57.58%, 6.47%, 0.11)" });
    gsap.set(card_bg_img, { scale: 1 });
    gsap.set(card, { scale: 1 });

    // Mouse tracking variables
    let mouseX = 0;
    let mouseY = 0;

    // Track mouse movement over the card
    card.on("mousemove", function (e) {
      // Get the mouse position relative to the card
      const cardRect = card[0].getBoundingClientRect(); // DOM method for getting card's dimensions
      mouseX = e.clientX - cardRect.left; // X position relative to the card
      mouseY = e.clientY - cardRect.top;  // Y position relative to the card

      // Optionally, log the mouse position for debugging
      console.log("Mouse X:", mouseX, "Mouse Y:", mouseY);

      // Update rotation based on mouse position
      gsap.to(card, {
        duration: 0.1,
        //rotateX: mapRange(mouseY, 0, cardRect.height, 10, -10),  // Map mouseY to rotateX
        rotateY: mapRange(mouseX, 0, cardRect.width, -10, 10),   // Map mouseX to rotateY
        scale: 1.02,
        ease: "power1.inOut"
      });
    });

    // Utility function to map a value from one range to another
    function mapRange(value, inMin, inMax, outMin, outMax) {
      return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    // Build the timeline with sequential animations
    tl.to(card_para, {
      duration: 0.5,
      height: autoHeight,
      marginTop: "20px",
      ease: "power1.inOut"
    }).to(card_para, {
      duration: 0.6,
      opacity: 1,
      y: "0%",
      ease: "power1.inOut"
    }, "<").to(card_bg, {
      duration: 0.6,
      backgroundColor: "hsla(104.21052631578948, 57.58%, 6.47%, 0.75)", // Full opacity
      ease: "power1.inOut"
    }, "<").to(card_bg_img, {
      duration: 0.5,
      scale: 1.05, // Scale up to 1.1 on hover
      ease: "power1.inOut"
    }, "<");

    // Hover events
    card.hover(
      () => tl.play(),
      () => tl.reverse()
    );

    // Reset card to default on mouse leave
    card.on("mouseleave", function () {
      gsap.to(card, {
        duration: 0.5,
        rotateX: 0,  // Reset rotateX to 0
        rotateY: 0,  // Reset rotateY to 0
        scale: 1,    // Reset scale to 1
        ease: "power1.inOut"
      });
    });
  });

}

// Function to check if it's a desktop breakpoint
function isDesktop() {
  return window.matchMedia("(min-width: 992px)").matches;
}

// Initialize animations only for desktop
function setupAnimations() {
  if (isDesktop()) {
    initializeCardAnimations();
  }
}

// Run setup on document ready
$(document).ready(setupAnimations);

// Re-run setup on window resize
//$(window).resize($.debounce(250, setupAnimations));

//---------------------------------------

$(document).ready(function () {


  // Link timelines to scroll position
  function createScrollTrigger(triggerElement, timeline) {
    // Reset tl when scroll out of view past bottom of screen
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => {
        timeline.progress(0);
        timeline.pause();
      }
    });
    // Play tl when scrolled into view (60% from top of screen)
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 80%",
      //markers: true,
      onEnter: () => timeline.play()
    });
  }

  $("[gsap-slide-up]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this), {
      yPercent: 50,
      duration: 0.5,
      ease: "power1.inOut"
    })
      .fromTo($(this), {
        opacity: 0,
        duration: 0.5,
        ease: "power1.inOut"
      }, {
        opacity: 1
      }, "<")
    createScrollTrigger($(this), tl);
  });

  $("[gsap-slide-up-stagger]").each(function (index, element) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(element).children(), {
      opacity: 0,
      yPercent: 50,
      duration: 0.5,
      ease: "power1.inOut",
      stagger: { amount: 0.5 }
    });
    createScrollTrigger($(element), tl);
  });

  $("[gsap-text-slide-up]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), {
      duration: 0.6,
      y: "150%",
      rotationX: -100,
      opacity: 0,
      ease: "power1.inOut",
      stagger: {
        amount: 0.2,
        from: "0"
      }
    });
    createScrollTrigger($(this), tl);
  });

  $("[gsap-lines-slide-right]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".split_line"), {
      opacity: 0,
      x: "2em",
      duration: 1,
      ease: "power2.out",
      stagger: { amount: 0.6 }
    });
    createScrollTrigger($(this), tl);
  });

  $("[gsap-zoom-in]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this), {
      duration: 0.6,
      opacity: 0,
      scale: 0.9,
    });
    createScrollTrigger($(this), tl);
  });

});

// // Link timelines to scroll position
// function createScrollTrigger(triggerElement, timeline) {
//     // Reset tl when scroll out of view past bottom of screen
//     ScrollTrigger.create({
//       trigger: triggerElement,
//       start: "top bottom",
//       onLeaveBack: () => {
//         timeline.progress(0);
//         timeline.pause();
//       }
//     });
//     // Play tl when scrolled into view (60% from top of screen)
//     ScrollTrigger.create({
//       trigger: triggerElement,
//       start: "top 60%",
//       //markers: true,
//       onEnter: () => timeline.play()
//     });
//   }

//   $("[gsap-slide-up]").each(function (index) {
//     let tl = gsap.timeline({ paused: true });
//     tl.from($(this), {
//       opacity: 0,
//       yPercent: 100,
//       duration: 0.5,
//       ease: "back.out(2)"
//       // stagger: { amount: 0.5 }
//     });
//     createScrollTrigger($(this), tl);
//   });

// $("[words-slide-up]").each(function (index) {
//   let tl = gsap.timeline({ paused: true });
//   tl.from($(this).find(".word"), {
//     opacity: 0,
//     yPercent: 100,
//     duration: 0.5,
//     ease: "back.out(2)",
//     stagger: { amount: 0.5 }
//   });
//   createScrollTrigger($(this), tl);
// });

// $("[words-rotate-in]").each(function (index) {
//   let tl = gsap.timeline({ paused: true });
//   tl.set($(this).find(".word"), { transformPerspective: 1000 });
//   tl.from($(this).find(".word"), {
//     rotationX: -90,
//     duration: 0.6,
//     ease: "power2.out",
//     stagger: { amount: 0.6 }
//   });
//   createScrollTrigger($(this), tl);
// });

// $("[words-slide-from-right]").each(function (index) {
//   let tl = gsap.timeline({ paused: true });
//   tl.from($(this).find(".word"), {
//     opacity: 0,
//     x: "1em",
//     duration: 0.6,
//     ease: "power2.out",
//     stagger: { amount: 0.2 }
//   });
//   createScrollTrigger($(this), tl);
// });

// $("[letters-slide-up]").each(function (index) {
//   let tl = gsap.timeline({ paused: true });
//   tl.from($(this).find(".char"), {
//     yPercent: 100,
//     duration: 0.2,
//     ease: "power1.out",
//     stagger: { amount: 0.6 }
//   });
//   createScrollTrigger($(this), tl);
// });

// $("[letters-slide-down]").each(function (index) {
//   let tl = gsap.timeline({ paused: true });
//   tl.from($(this).find(".char"), {
//     yPercent: -120,
//     duration: 0.3,
//     ease: "power1.out",
//     stagger: { amount: 0.7 }
//   });
//   createScrollTrigger($(this), tl);
// });

// $("[letters-fade-in]").each(function (index) {
//   let tl = gsap.timeline({ paused: true });
//   tl.from($(this).find(".char"), {
//     opacity: 0,
//     duration: 0.2,
//     ease: "power1.out",
//     stagger: { amount: 0.8 }
//   });
//   createScrollTrigger($(this), tl);
// });

// $("[letters-fade-in-random]").each(function (index) {
//   let tl = gsap.timeline({ paused: true });
//   tl.from($(this).find(".char"), {
//     opacity: 0,
//     duration: 0.05,
//     ease: "power1.out",
//     stagger: { amount: 0.4, from: "random" }
//   });
//   createScrollTrigger($(this), tl);
// });

// $("[scrub-each-word]").each(function (index) {
//   let tl = gsap.timeline({
//     scrollTrigger: {
//       trigger: $(this),
//       markers: true,
//       start: "top 40%",
//       end: "bottom 50%",
//       scrub: true
//     }
//   });
//   tl.from($(this).find(".word"), {
//     opacity: 0.2,
//     duration: 0.2,
//     ease: "power1.out",
//     stagger: { each: 0.4 }
//   });
// });

// Avoid flash of unstyled content
gsap.set("[text-split]", { opacity: 1 });