import PopupRenderer, {
  ATTR_POPUP_ARROW,
  ATTR_POPUP_TITLE,
  ATTR_POPUP_CONTAINER,
  ATTR_POPUP_ERROR_CONTAINER,
  ATTR_POPUP_LOADING,
} from '../renderer/PopupRenderer';
import { parseTemplate } from '../util';
import Theme from '../Theme';
import { ATTR_ACTION_CONTAINER, ATTR_CANCEL_BTN, ATTR_EDIT_CONTAINER, ATTR_LOADING_CONTAINER, ATTR_READ_CONTAINER, ATTR_SUBMIT_BTN } from '../config';

interface BootstrapThemeConfig {
  size: 'xs' | 'md' | 'lg' | 'xl' | 'sm';
  okBtntnTheme: string;
  cancelBtnTheme: string;
  spinnerTheme: string;
  inline: boolean;
}

export const BootstrapThemeBaseConfig: BootstrapThemeConfig = {
  size: 'sm',
  okBtntnTheme: 'primary',
  cancelBtnTheme: 'light',
  spinnerTheme: 'primary',
  inline: false,
};

export default ({ size, okBtntnTheme, cancelBtnTheme, spinnerTheme, inline }: BootstrapThemeConfig): Theme => {
  return {
    types: {
      text: {
        class: `form-control form-control-${size}`
      },
      select: {
        class: `form-control form-control-${size}`
      },
      checkbox: {
        inputContainerClass: `form-check ${inline ? 'form-check-inline' : ''}`,
        checkboxClass: 'form-check-input',
        labelClass: 'form-check-label'
      },
      radio: {
        inputContainerClass: `pl-0 form-check ${inline ? 'form-check-inline' : ''}`,
        checkboxClass: 'form-check-input',
        labelClass: 'form-check-label'
      }
    },
    renderers: {
      popup: {
        popupTemplate:  `
          <div class="popover show bs-popover-top ">
            <div class="arrow" ${ATTR_POPUP_ARROW}></div>
            <h3 class="popover-header" ${ATTR_POPUP_TITLE}></h3>
            <div class="popover-body">
              <div class="d-flex align-items-center">
                <div ${ATTR_POPUP_CONTAINER}></div>
                <div class="flyter-popup-loading" ${ATTR_POPUP_LOADING}></div>
              </div>
              <div class="invalid-feedback d-block" ${ATTR_POPUP_ERROR_CONTAINER}></div>
            </div>
          </div>
        `.trim(),
        onInit(renderer: PopupRenderer) {
          const element = renderer.getMarkup() as HTMLElement;

          const updatePlacement = (placement: string) => {
            element.className = `popover show bs-popover-${placement}`;
            element.setAttribute('x-placement', placement);
          };

          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'attributes') {
                const placement = element.getAttribute('data-popper-placement');
                if (element.getAttribute('x-placement') !== placement && placement !== null) {
                  updatePlacement(placement);
                }
              }
            });
          });

          observer.observe(element, { attributes: true });
          const instance = renderer.getPopperInstance();
          if (instance !== null) updatePlacement(instance.state.placement);
        },
      }
    },
    config: {
      onError({}, instance) {
        const session = instance.getCurrentSession();
        if (session === null) return;
        const markup = session.getSessionMarkup();
        [...Array.from(markup.querySelectorAll('input')), markup.querySelectorAll('textarea')].forEach((input) => {
          (input as HTMLElement).classList.add('is-invalid');
        });
      },
      onRendererLoading(status, instance) {
        const session = instance.getCurrentSession();
        if (session === null) return;
        const markup = session.getSessionMarkup();
        const loadingMarkup = parseTemplate(`<span class="spinner-border text-white spinner-border-${size} mr-1" role="status" aria-hidden="true"></span>`); 
        const btn = markup.querySelector(`[${ATTR_SUBMIT_BTN}]`);
        console.log(loadingMarkup);
        if (btn) {
          if (status) btn.insertAdjacentElement('afterbegin', loadingMarkup);
          else btn.removeChild(btn.firstChild as ChildNode);  
        }
      },
      template: {
        edit: `
          <div>
            <div class="flyter-edit-container d-flex">
              <div ${ATTR_EDIT_CONTAINER} class="mr-2"></div>
              <div class="flyter-action-container" ${ATTR_ACTION_CONTAINER}></div>
            </div>
          </div>
        `.trim(),
        buttons: `
          <div class="btn-group">
            <button type="button" class="btn btn-${okBtntnTheme} btn-${size} d-flex align-items-center" ${ATTR_SUBMIT_BTN}></button>
            <button type="button" class="btn btn-${cancelBtnTheme} btn-${size}" ${ATTR_CANCEL_BTN}></button>
          </div>
        `.trim(),
        read: `
          <div class="flyter-read-container d-flex align-items-center">
            <span ${ATTR_READ_CONTAINER}></span>
            <span ${ATTR_LOADING_CONTAINER}></span>
          </div>
        `.trim(),
        loading: `
          <div class="ml-2 spinner-border text-${spinnerTheme} spinner-border-${size}"></div>
        `,
      },
    }
  };
};