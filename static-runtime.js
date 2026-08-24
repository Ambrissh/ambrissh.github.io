(() => {
  const lazyImages = document.querySelectorAll("img[data-lazy-src]");
  const loadImage = (image) => {
    image.src = image.dataset.lazySrc;
    image.removeAttribute("data-lazy-src");
  };

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        loadImage(entry.target);
        observer.unobserve(entry.target);
      }
    });
    lazyImages.forEach((image) => imageObserver.observe(image));
  } else {
    lazyImages.forEach(loadImage);
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-podcast-video]");
    if (!button) return;

    const iframe = document.createElement("iframe");
    iframe.className = "absolute inset-0 h-full w-full";
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(button.dataset.videoId)}?autoplay=1`;
    iframe.title = button.dataset.videoTitle || "Podcast episode";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    button.replaceWith(iframe);
  });

  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const submit = form.querySelector("[data-contact-submit]");
  const label = form.querySelector("[data-contact-submit-label]");
  const error = form.querySelector("[data-contact-error]");
  const success = document.querySelector("[data-contact-success]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submit.disabled = true;
    label.textContent = "Sending...";
    error.hidden = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Form submission failed");

      form.hidden = true;
      success.hidden = false;
    } catch {
      error.hidden = false;
      submit.disabled = false;
      label.textContent = "Send Thoughts";
    }
  });
})();
