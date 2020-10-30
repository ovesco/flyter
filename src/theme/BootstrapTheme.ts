import PopupRenderer, {
  ATTR_POPUP_ARROW,
  ATTR_POPUP_TITLE,
  ATTR_POPUP_CONTAINER,
  ATTR_POPUP_ERROR_CONTAINER,
  ATTR_POPUP_LOADING,
} from '../renderer/PopupRenderer';
import { parseTemplate, promisify, resolveAsync } from '../util';
import Theme from '../Theme';
import { ATTR_ACTION_CONTAINER, ATTR_CANCEL_BTN, ATTR_EDIT_CONTAINER, ATTR_LOADING_CONTAINER, ATTR_READ_CONTAINER, ATTR_SUBMIT_BTN } from '../config';

interface BootstrapThemeConfig {
  size: 'xs' | 'md' | 'lg' | 'xl' | 'sm';

}

export const BootstrapThemeBaseConfig: BootstrapThemeConfig = {
  size: 'md',
};

export default ({ size }: BootstrapThemeConfig): Theme => {
  return {
    types: {
      text: {
        class: `form-control form-control-${size}`
      },
      select: {
        class: `form-control form-control-${size}`
      },
      checkbox: {
        class: `form-control form-control-${size}`
      },
      radio: {
        class: `form-control form-control-${size}`
      }
    },
    renderers: {
      popup: {
        popupTemplate: async (renderer: PopupRenderer) => {
          const placement = (await promisify(resolveAsync(renderer.getRendererConfig().popperConfig))).placement;
          return `
          <div class="popover show bs-popover-${placement}">
            <div class="arrow" ${ATTR_POPUP_ARROW}></div>
            <h3 class="popover-header" ${ATTR_POPUP_TITLE}></h3>
            <div class="popover-body">
              <div class="d-flex align-items-center">
                <div ${ATTR_POPUP_CONTAINER}></div>
                <div class="flyter-popup-loading" ${ATTR_POPUP_LOADING}>
                  <span class="spinner-border spinner-border-${size}" role="status" aria-hidden="true"></span>
                </div>
              </div>
              <div class="invalid-feedback d-block" ${ATTR_POPUP_ERROR_CONTAINER}></div>
            </div>
          </div>`;
        },
      }
    },
    config: {
      onError(instance) {
        const markup = instance.getCurrentSession().getSessionMarkup();
        [...markup.querySelectorAll('input'), markup.querySelectorAll('textarea')].forEach((input) => {
          (input as HTMLElement).classList.add('is-invalid');
        });
      },
      onRendererLoading(status, instance) {
        const markup = instance.getCurrentSession().getSessionMarkup();
        const loadingMarkup = parseTemplate(`<span class="spinner-border spinner-border-${size}" role="status" aria-hidden="true"></span>`); 
        const btn = markup.querySelector(`[${ATTR_SUBMIT_BTN}]`);
        if (btn) {
          if (status) btn.insertAdjacentElement('afterbegin', loadingMarkup);
          else btn.removeChild(btn.firstChild);  
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
        `,
        buttons: `
          <div class="btn-group">
            <button type="button" class="btn btn-primary btn-${size}" ${ATTR_SUBMIT_BTN}></button>
            <button type="button" class="btn btn-primary btn-${size}" ${ATTR_CANCEL_BTN}></button>
          </div>
        `,
        read: `
          <div class="flyter-read-container d-flex align-items-center">
            <span ${ATTR_READ_CONTAINER}></span>
            <span ${ATTR_LOADING_CONTAINER}></span>
          </div>
        `,
        loading: `
          <div class="ml-2 spinner-border text-primary spinner-border-${size}"></div>
        `,
      },
    }
  };
};