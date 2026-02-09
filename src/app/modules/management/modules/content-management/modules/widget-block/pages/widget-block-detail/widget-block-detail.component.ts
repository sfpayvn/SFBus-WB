import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WidgetBlockService } from '../../service/widget-block.servive';
import { FileDto } from 'src/app/modules/management/modules/files-center-management/model/file-center.model';
import { FilesCenterDialogComponent } from 'src/app/modules/management/modules/files-center-management/components/files-center-dialog/files-center-dialog.component';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import grapesjs, { Editor } from 'grapesjs';
import presetWebpage from 'grapesjs-preset-webpage';
import basicBlocks from 'grapesjs-blocks-basic';
import forms from 'grapesjs-plugin-forms';
import navbar from 'grapesjs-navbar';
import customCode from 'grapesjs-custom-code';
import tabs from 'grapesjs-tabs';
import { toast } from 'ngx-sonner';
import { Utils } from '@rsApp/shared/utils/utils';
import { WidgetBlock, WidgetBlock2Create } from '../../model/widget-block.model';

@Component({
  selector: 'app-widget-block-detail',
  templateUrl: './widget-block-detail.component.html',
  styleUrls: ['./widget-block-detail.component.scss'],
  standalone: false,
})
export class WidgetBlockDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private editor!: Editor;
  private blockCssMap = new Map<string, string>();

  widgetBlock: WidgetBlock | null = null;

  widgetBlockForm!: FormGroup;
  imageFile!: File;
  imageUrl!: string;
  initialFormValue!: string;

  constructor(
    private widgetBlocksService: WidgetBlockService,
    private formBuilder: FormBuilder,
    private utilsModal: UtilsModal,
    private utils: Utils,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.loadWidgetTestData();
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['widgetBlock']) {
      this.widgetBlock = params['widgetBlock'] ? JSON.parse(params['widgetBlock']) : null;
    }
    this.initializeForm();
  }

  private initializeForm(): void {
    const { name = '', imageId = '', imageUrl = '' } = this.widgetBlock || {};
    this.imageUrl = imageUrl;
    this.widgetBlockForm = this.formBuilder.group({
      name: [name, [Validators.required, Validators.minLength(3)]],
      imageId: [imageId, [Validators.required]],
    });
    this.initialFormValue = JSON.stringify(this.widgetBlockForm.getRawValue());
  }

  async ngAfterViewInit(): Promise<void> {
    this.editor = grapesjs.init({
      container: '#gjs',
      height: '100%',
      fromElement: false,
      storageManager: false,

      plugins: [
        presetWebpage, // block cơ bản + style manager
        basicBlocks, // thêm block layout/media/text/grid
        forms, // form blocks
        navbar, // navbar block
        tabs, // tabs block
        customCode, // block custom code
        'grapesjs-swiper-slider', // slider block
      ],

      pluginsOpts: {
        [basicBlocks as any]: {
          flexGrid: true, // ✅ có flex/grid layout
        },
        'grapesjs-swiper-slider': {},
      },
    });
    // await this.loadBlockLibrary();
    this.addBlocks();

    // ✅ refresh để canvas tính lại size
    setTimeout(() => this.editor.refresh(), 0);
    setTimeout(() => {
      this.editor.refresh();
      this.editor.loadProjectData(JSON.parse(this.widgetBlock?.projectData || '{}'));
    }, 200);
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;
    const file = files[0];
    this.imageFile = file;

    if (file) {
      this.readAndSetImage(file);
    }
  }

  private readAndSetImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // Tạo một Blob từ ArrayBuffer
      const arrayBuffer = event.target.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);
      this.imageUrl = blobUrl;
    };
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  removeFileImage() {
    this.imageUrl = '';
    this.widgetBlockForm.patchValue({ imageId: '' });
  }

  openFilesCenterDialog() {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;
      this.imageUrl = files[0].link;
      this.widgetBlockForm.patchValue({ imageId: files[0]._id });
    });
  }
  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  // private async loadBlockLibrary() {
  //   const blocks: WidgetBlock[] = await firstValueFrom(this.widgetBlocksService.findAll());

  //   blocks.forEach((b) => this.addDbBlockToGrapes(b));
  // }

  private addBlocks() {
    const ed = this.editor;
    const dc = ed.DomComponents;
    const bm = ed.BlockManager;

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

  private addDbBlockToGrapes(b: WidgetBlock) {
    const blockId = `db-${b._id}`;

    // nhớ css để lúc drop sẽ add
    if (b.css) this.blockCssMap.set(blockId, b.css);

    this.editor.BlockManager.add(blockId, {
      category: 'Custom Blocks',
      label: `
        <div style="display:flex;gap:8px;align-items:center;min-width:200px">
          <img src="${b.imageUrl}"
               style="width:36px;height:36px;border-radius:8px;object-fit:cover" />
          <div style="text-align:left">
            <div style="font-weight:600;font-size:12px;line-height:14px">${b.name}</div>
          </div>
        </div>
      `,
      // ✅ content là html block
      // ⚠️ Trick: nhúng css vào <style> để block tự sống độc lập cũng được
      content: b.css ? `${b.html}<style>${b.css}</style>` : b.html,
    });
  }

  hasFormChanged(): boolean {
    const currentFormValue = this.widgetBlockForm.getRawValue();
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(currentFormValue);
  }

  onSubmit() {
    if (!this.widgetBlockForm.valid) {
      this.utils.markFormGroupTouched(this.widgetBlockForm);
      return;
    }

    // Check if there are any changes
    if (!this.hasFormChanged()) {
      return;
    }

    const wrapper = this.editor.getWrapper();
    if (!wrapper) return;

    const html = wrapper
      .components()
      .map((c: any) => c.toHTML())
      .join('');

    const css = this.editor.getCss();

    const projectData = this.editor.getProjectData();

    const { name, imageId } = this.widgetBlockForm.value;

    let dataTransfer = new DataTransfer();

    // Validate and add imageFile
    if (this.imageFile) {
      dataTransfer.items.add(this.imageFile);
    }
    const files: FileList = dataTransfer.files;

    const widgetBlock2Create: WidgetBlock2Create = {
      imageId,
      name,
      html,
      css,
      projectData: JSON.stringify(projectData),
    };

    this.widgetBlocksService.processCreateWidgetBlock(files, widgetBlock2Create).subscribe({
      next: (res: WidgetBlock) => {
        if (res) {
          // this.loadBlockLibrary();
          toast.success('WidgetBlock added successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  preview() {
    this.editor.runCommand('preview');
  }

  backPage(): void {
    window.history.back();
  }

  loadWidgetTestData(): void {
    
  }
}
