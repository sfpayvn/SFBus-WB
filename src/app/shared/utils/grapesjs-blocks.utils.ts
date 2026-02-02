import { WidgetBlock } from '@rsApp/modules/management/modules/content-management/modules/widget-block/model/widget-block.model';
import { Editor } from 'grapesjs';

/**
 * GrapesJS Blocks Utilities
 * Reusable functions for adding custom blocks and components to GrapesJS editors
 */

export class GrapesJSBlocksUtils {
  /**
   * Add Swiper Slider component and related blocks to GrapesJS editor
   * @param editor GrapesJS Editor instance
   */
  static addSwiperSliderBlocks(editor: Editor): void {
    const dc = editor.DomComponents;
    const bm = editor.BlockManager;
    const ed = editor;

    // ✅ Slide component (droppable để kéo thả text/image vào)
    dc.addType('sf-swiper-slide', {
      isComponent: (el) => el.classList?.contains('swiper-slide'),
      model: {
        defaults: {
          classes: ['swiper-slide'],
          style: {
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            padding: '20px',
            'min-height': '220px',
          },
          droppable: true, // ✅ quan trọng: cho thả content vào slide
          components: `
          <div style="text-align:center">
            <h3 style="margin:0 0 6px 0;">Slide title</h3>
            <p style="margin:0;opacity:.7">Drop image/text here</p>
          </div>
        `,
        },
      },
    });

    // ✅ Root Swiper component
    dc.addType('sf-swiper-slider', {
      model: {
        defaults: {
          tagName: 'section',
          classes: ['sf-swiper-root'],
          traits: [
            { type: 'checkbox', name: 'data-loop', label: 'Loop' },
            { type: 'checkbox', name: 'data-pagination', label: 'Pagination' },
            { type: 'checkbox', name: 'data-navigation', label: 'Navigation' },
          ],
          components: [
            {
              tagName: 'div',
              classes: ['swiper'],
              style: { width: '100%', height: '260px' },
              components: [
                {
                  tagName: 'div',
                  classes: ['swiper-wrapper'],
                  components: [{ type: 'sf-swiper-slide' }, { type: 'sf-swiper-slide' }, { type: 'sf-swiper-slide' }],
                },
                { tagName: 'div', classes: ['swiper-pagination'] },
                { tagName: 'div', classes: ['swiper-button-prev'] },
                { tagName: 'div', classes: ['swiper-button-next'] },
              ],
            },
          ],

          // ✅ Toolbar: Add / Remove slide ngay khi chọn widget
          toolbar: [
            { command: 'sf-swiper-add-slide', label: '+ Slide' },
            { command: 'sf-swiper-remove-slide', label: '- Slide' },
          ],

          // ✅ Script chạy trong canvas (iframe) để slider chạy + tự update khi thay đổi slide
          script: function () {
            const root = this;
            const win = window as any;

            const loadCss = (href: string) =>
              new Promise<void>((res) => {
                if (document.querySelector(`link[href="${href}"]`)) return res();
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.onload = () => res();
                document.head.appendChild(link);
              });

            const loadJs = (src: string) =>
              new Promise<void>((res) => {
                if (document.querySelector(`script[src="${src}"]`)) return res();
                const s = document.createElement('script');
                s.src = src;
                s.onload = () => res();
                document.body.appendChild(s);
              });

            const cssUrl = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
            const jsUrl = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';

            const getBool = (name: string, def = true) => {
              const v = root['getAttribute'](name);
              if (v === null || v === undefined || v === '') return def;
              return v === 'true' || v === '1';
            };

            Promise.all([loadCss(cssUrl), loadJs(jsUrl)]).then(() => {
              const el = root['querySelector']('.swiper') as any;
              if (!el || !win.Swiper) return;

              // destroy old instance if exists
              if ((root as any).__swiper) {
                try {
                  (root as any).__swiper.destroy(true, true);
                } catch {}
              }

              const loop = getBool('data-loop', true);
              const pagination = getBool('data-pagination', true);
              const navigation = getBool('data-navigation', true);

              const swiper = new win.Swiper(el, {
                loop,
                pagination: pagination ? { el: el.querySelector('.swiper-pagination'), clickable: true } : undefined,
                navigation: navigation
                  ? {
                      nextEl: el.querySelector('.swiper-button-next'),
                      prevEl: el.querySelector('.swiper-button-prev'),
                    }
                  : undefined,
              });

              (root as any).__swiper = swiper;

              // ✅ auto update khi user add/remove/change slide content
              const wrapper = el.querySelector('.swiper-wrapper');
              if (wrapper) {
                const obs = new MutationObserver(() => {
                  try {
                    swiper.update();
                  } catch {}
                });
                obs.observe(wrapper, { childList: true, subtree: true });
              }
            });
          },
        },
      },
    });

    // ✅ Commands: Add/Remove slides
    ed.Commands.add('sf-swiper-add-slide', {
      run(editor) {
        const selected = editor.getSelected();
        if (!selected) return;

        const root = selected.closestType('sf-swiper-slider') || selected;
        const swiper = root.find('.swiper-wrapper')[0];
        if (!swiper) return;

        swiper.append({ type: 'sf-swiper-slide' });
        editor.select(root);
      },
    });

    ed.Commands.add('sf-swiper-remove-slide', {
      run(editor) {
        const selected = editor.getSelected();
        if (!selected) return;

        const root = selected.closestType('sf-swiper-slider') || selected;
        const wrapper = root.find('.swiper-wrapper')[0];
        if (!wrapper) return;

        const slides = wrapper.components();
        if (slides.length <= 1) return;
        slides.at(slides.length - 1).remove();
        editor.select(root);
      },
    });

    // ✅ Add block
    bm.add('sf-swiper-slider-block', {
      label: 'Swiper Slider (Editable)',
      category: 'Widgets',
      content: { type: 'sf-swiper-slider' },
    });
  }

  /**
   * Add custom database block to GrapesJS editor
   * @param editor GrapesJS Editor instance
   * @param widgetBlock Widget block data from database
   * @param toolbar Optional toolbar configuration for the block
   */
  static addDbBlock(editor: Editor, widgetBlock: WidgetBlock, toolbar?: any[]): void {
    const bm = editor.BlockManager;
    const blockId = `db-${widgetBlock._id}`;
    
    bm.add(blockId, {
      category: 'Custom Blocks',
      label: `
        <div style="display:flex;gap:8px;align-items:center;flex-direction: column;">
          <img src="${widgetBlock.imageUrl}" alt="${widgetBlock.name}"
               style="width:36px;height:36px;border-radius:8px;object-fit:cover" />
          <div style="text-align:left">
            <div style="font-weight:600;font-size:12px;line-height:14px">${widgetBlock.name}</div>
          </div>
        </div>
      `,
      content: widgetBlock.css ? `<div data-block-id="${blockId}">${widgetBlock.html}<style>${widgetBlock.css}</style></div>` : `<div data-block-id="${blockId}">${widgetBlock.html}</div>`,
      ...(toolbar && { toolbar }),
    });
  }
}
