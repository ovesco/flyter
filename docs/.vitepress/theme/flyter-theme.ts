export default () => ({
  types: {
    text: {
      class:
        "py-1 px-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-100 rounded-xl bg-white dark:bg-gray-600 dark:text-white/80",
    },
    select: {
      class:
        "py-1 px-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-100 rounded-xl bg-white dark:bg-gray-600 dark:text-white/80",
    },
    checkbox: {
      inputContainerClass: "",
      checkboxClass: "",
      labelClass: "",
    },
    radio: {
      inputContainerClass: "pl-0",
      checkboxClass: "",
      labelClass: "",
    },
  },
  renderers: {
    inline: {
      containerClass: "p-2 bg-slate-200 rounded-2xl dark:bg-gray-700",
    },
    popup: {
      /**
       * This is the template for the popup renderer. You can customize this to
       * match your own design. The template uses TailwindCSS classes to style
       * the popup.
       */
      popupTemplate: `
          <div>
            <div class="arrow" data-flyter-popup-arrow></div>
            <h3 class="" data-flyter-popup-title></h3>
            <div class="p-3 bg-slate-200 rounded-2xl dark:bg-gray-700 relative overflow-hidden">
              <div>
                <div data-flyter-popup-container></div>
              </div>
              <div data-flyter-popup-loading class="absolute w-full h-full top-0 left-0 bg-gray-700/80 flex items-center justify-center">
                <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                  viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve" class="w-10 h-10">
                    <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                      <animateTransform 
                        attributeName="transform" 
                        attributeType="XML" 
                        type="rotate"
                        dur="1s" 
                        from="0 50 50"
                        to="360 50 50" 
                        repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
              <div class="bg-red-100 text-red-700 text-center py-1 rounded-xl mt-2 dark:bg-red-700 dark:text-red-200" data-flyter-popup-error></div>
            </div>
          </div>
        `.trim(),
      onInit(renderer: any) {
        const element = renderer.getMarkup() as HTMLElement;

        const updatePlacement = (placement: string) => {
          const arrow = element.querySelector(
            ".arrow"
          ) as HTMLDivElement | null;
          if (arrow) {
            let className = "arrow h-0 w-0 border-x-8 border-x-transparent";
            if (placement === "bottom") {
              className +=
                " border-b-[12px] border-b-slate-200 dark:border-b-slate-700 -mt-[8px]";
            } else if (placement === "top") {
              className +=
                " border-t-[12px] border-t-slate-200 dark:border-t-slate-700 top-full -mt-1";
            }
            arrow.className = className;
            element.setAttribute("x-placement", placement);
          }
        };

        /**
         * This observer listens for changes in the data-popper-placement attribute
         * and updates the arrow placement accordingly.
         */
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "attributes") {
              const placement = element.getAttribute("data-popper-placement");
              if (
                element.getAttribute("x-placement") !== placement &&
                placement !== null
              ) {
                updatePlacement(placement);
              }
            }
          });
        });

        observer.observe(element, { attributes: true });
        const instance = renderer.getPopperInstance();
        if (instance !== null) updatePlacement(instance.state.placement);
      },
    },
  },
  config: {
    onError({}, instance) {
      const session = instance.getCurrentSession();
      if (session === null) return;
      const markup = session.getSessionMarkup();
      [
        ...Array.from(markup.querySelectorAll("input")),
        ...Array.from(markup.querySelectorAll("textarea")),
      ].forEach((input) => {
        if ((input as HTMLElement).classList) {
          (input as HTMLElement).classList.add(
            ..."border-red-500 text-red-500".split(" ")
          );
        }
      });
    },
    template: {
      edit: `
          <div>
            <div class="flex">
              <div data-flyter-edit class=""></div>
              <div class="ml-2" data-flyter-action></div>
            </div>
          </div>
        `.trim(),
      buttons: `
          <div class="flex h-full items-center">
            <button type="button" class="text-sm bg-blue-500 dark:bg-blue-600 dark:disabled:hover:bg-blue-600 disabled:hover:bg-blue-500 dark:hover:bg-blue-700 py-1 disabled:opacity-50 text-white hover:bg-blue-600 w-10 rounded-l-xl" data-flyter-submit></button>
            <button type="button" class="text-sm bg-slate-400 dark:bg-gray-600 dark:hover:bg-gray-800 py-1 disabled:opacity-50 disabled:hover:bg-slate-400 dark:disabled:hover:bg-gray-600 text-white hover:bg-slate-500 w-16 rounded-r-xl" data-flyter-cancel></button>
          </div>
        `.trim(),
      read: `
          <div class="flyter-read-container flex items-center relative">
            <span data-flyter-read></span>
            <span data-flyter-loading></span>
          </div>
        `.trim(),
      loading: `
          <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve" class="w-6 h-6">
              <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                <animateTransform 
                  attributeName="transform" 
                  attributeType="XML" 
                  type="rotate"
                  dur="1s" 
                  from="0 50 50"
                  to="360 50 50" 
                  repeatCount="indefinite" />
            </path>
          </svg>
        `,
    },
  },
});
