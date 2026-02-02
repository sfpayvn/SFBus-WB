import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ContentLayoutService } from '../../service/content-layout.servive';
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
import {
  ContentLayout,
  ContentLayout2Create,
  ContentLayout2Update,
  ContentLayoutZone,
} from '../../model/content-layout.model';
import {
  APP_SOURCE,
  APP_SOURCES_OPTIONS,
  PLATFORM_DEFAULT_APP_SOURCE,
  PLATFORM_DEFAULT_APP_SOURCES_OPTIONS,
} from '@rsApp/core/constants/app-source.constant';
import { WidgetBlockService } from '../../../widget-block/service/widget-block.servive';
import { WidgetBlock } from '../../../widget-block/model/widget-block.model';
import { GrapesJSBlocksUtils } from '@rsApp/shared/utils/grapesjs-blocks.utils';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-content-layout-detail',
  templateUrl: './content-layout-detail.component.html',
  styleUrls: ['./content-layout-detail.component.scss'],
  standalone: false,
})
export class ContentLayoutDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private editor!: Editor;
  private blockCssMap = new Map<string, string>();

  contentLayout: ContentLayout | null = null;

  contentLayoutForm!: FormGroup;
  imageFile!: File;
  imageUrl!: string;
  initialFormValue!: string;

  appSources = APP_SOURCES_OPTIONS;
  platforms = PLATFORM_DEFAULT_APP_SOURCES_OPTIONS;

  isNonEndDate: boolean = false;

  isPage: boolean = false;

  // Regex pattern cho slug URL: bắt đầu bằng / và chứa chữ cái, số, dấu gạch ngang (-), dấu gạch chân (_), dấu /
  // Ví dụ: /tabs, /home, /api/v1/users, /about-us, /products_list
  private readonly SLUG_PATTERN = /^\/[a-zA-Z0-9_\/-]*$/;

  /**
   * Chuyển form value thành comparable string
   * Date objects được convert thành ISO string để so sánh ổn định
   */
  private getFormValueAsComparable(): string {
    const formValue = this.contentLayoutForm.getRawValue();
    const comparable = {
      ...formValue,
      startDate: formValue.startDate ? new Date(formValue.startDate).toISOString() : null,
      endDate: formValue.endDate ? new Date(formValue.endDate).toISOString() : null,
    };
    return JSON.stringify(comparable);
  }

  constructor(
    private contentLayoutService: ContentLayoutService,
    private formBuilder: FormBuilder,
    private utilsModal: UtilsModal,
    private utils: Utils,
    private widgetBlocksService: WidgetBlockService,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['contentLayout']) {
      this.contentLayout = params['contentLayout'] ? JSON.parse(params['contentLayout']) : null;
    }
    this.initializeForm();
  }

  private initializeForm(): void {
    const {
      name = '',
      imageId = '',
      imageUrl = '',
      slug = '',
      description = '',
      appSource = APP_SOURCE.CLIENT,
      platform = PLATFORM_DEFAULT_APP_SOURCE.WEB,
      startDate = null,
      endDate = null,
    } = this.contentLayout || {};
    this.imageUrl = imageUrl;

    this.isPage = slug.startsWith('/pages');

    this.contentLayoutForm = this.formBuilder.group({
      name: [name, [Validators.required, Validators.minLength(3)]],
      slug: [slug.replace('/pages', ''), [Validators.required, Validators.minLength(3), this.slugValidator.bind(this)]],
      description: [description],
      imageId: [imageId, Validators.required],
      appSource: [appSource],
      platform: [platform],
      startDate: [startDate, [Validators.required]],
      endDate: [endDate],
    });
    this.initialFormValue = this.getFormValueAsComparable();
    this.isNonEndDate = !endDate;
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
    await this.loadBlockLibrary();
    this.addBlocks();
    this.setupEditorChangeListeners();

    // ✅ refresh để canvas tính lại size
    setTimeout(() => this.editor.refresh(), 0);
    setTimeout(() => {
      if (this.contentLayout?.projectData) {
        this.editor.loadProjectData(JSON.parse(this.contentLayout.projectData));
      } else {
        // Load default layout for create mode
        this.loadDefaultLayout();
      }
    }, 200);
  }

  /**
   * Bắt các sự kiện kéo thả, thêm/xoá/update component của GrapesJS
   * Mỗi khi có thay đổi, reset initialFormValue để form được đánh dấu là đã thay đổi
   */
  private setupEditorChangeListeners(): void {
    // Bắt sự kiện thêm component (kéo thả)
    this.editor.on('component:mount', () => {
      this.onEditorContentChanged();
    });

    // Bắt sự kiện xóa component
    this.editor.on('component:remove', () => {
      this.onEditorContentChanged();
    });

    // Bắt sự kiện update component (đổi tên, class, v.v)
    this.editor.on('component:update', () => {
      this.onEditorContentChanged();
    });

    // Bắt sự kiện thay đổi style
    this.editor.on('style:change', () => {
      this.onEditorContentChanged();
    });

    // Bắt sự kiện thay đổi attribute
    this.editor.on('component:styleUpdate', () => {
      this.onEditorContentChanged();
    });
  }

  /**
   * Được gọi khi editor content thay đổi (kéo thả, thêm/xoá component, v.v)
   * Reset initialFormValue để form được đánh dấu là đã thay đổi
   */
  private onEditorContentChanged(): void {
    // Reset initialFormValue với một giá trị khác nhau để hasFormChanged() trả về true
    // Cách này giúp form nhận ra có thay đổi từ editor mà không cần tương tác với form fields
    this.initialFormValue = JSON.stringify({ _editorChanged: true, timestamp: Date.now() });
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
      this.contentLayoutForm.patchValue({ imageId: 'new' });
    };
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  removeFileImage() {
    this.imageUrl = '';
    this.contentLayoutForm.patchValue({ imageId: '' });
  }

  /**
   * Đọc hình ảnh từ clipboard (hình ảnh chụp màn hình)
   * Hỗ trợ paste image từ Ctrl+V hoặc nút "Paste Image"
   */
  async pasteImageFromClipboard(): Promise<void> {
    try {
      const items = await navigator.clipboard.read();

      for (const item of items) {
        // Kiểm tra có file image không
        if (
          item.types.includes('image/png') ||
          item.types.includes('image/jpeg') ||
          item.types.includes('image/webp')
        ) {
          const imageBlob = await item
            .getType('image/png')
            .catch(() => item.getType('image/jpeg').catch(() => item.getType('image/webp')));

          if (imageBlob) {
            // Chuyển Blob thành File
            const file = new File([imageBlob], `screenshot-${Date.now()}.png`, { type: imageBlob.type });
            this.imageFile = file;
            this.readAndSetImage(file);
            toast.success('Hình ảnh đã được paste thành công');
            return;
          }
        }
      }
      toast.error('Vui lòng copy một hình ảnh trước khi paste');
    } catch (error) {
      console.error('Lỗi khi paste image từ clipboard:', error);
      toast.error('Không thể paste hình ảnh. Vui lòng kiểm tra quyền clipboard hoặc thử cách khác');
    }
  }

  /**
   * Validator tùy chỉnh để kiểm tra slug có đúng định dạng URL path không
   * Slug phải bắt đầu bằng / và chỉ được chứa: chữ cái (a-z, A-Z), số (0-9), dấu gạch ngang (-), dấu gạch chân (_), dấu /
   * Ví dụ: /tabs, /api/v1/users, /about-us
   */
  private slugValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Để validators khác xử lý required
    }

    const slug = control.value.trim();

    if (!this.SLUG_PATTERN.test(slug)) {
      return {
        invalidSlug: {
          value: slug,
          message:
            'Slug phải bắt đầu bằng "/" và chỉ chứa chữ cái, số, dấu gạch ngang (-), dấu gạch chân (_). Ví dụ: /tabs, /api/v1/users',
        },
      };
    }

    return null; // Slug hợp lệ
  }

  openFilesCenterDialog() {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;
      this.imageUrl = files[0].link;
      this.contentLayoutForm.patchValue({ imageId: files[0]._id });
    });
  }
  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  private loadDefaultLayout(): void {
    const wrapper = this.editor.getWrapper();
    if (!wrapper) return;

    // Clear existing content
    wrapper.components().forEach((c: any) => c.remove());

    // Create main grid container (droppable)
    const mainContainers = wrapper.append({
      tagName: 'div',
      attributes: { id: 'main-container' },
      droppable: true,
      ...this.getContainerConfig(),
      style: {
        display: 'grid',
        'grid-template-columns': '1fr 2fr 1fr',
        'grid-template-rows': 'auto 1fr auto',
        'min-height': '100vh',
        gap: '0',
        width: '100%',
      },
    });
    const mainContainer = Array.isArray(mainContainers) ? mainContainers[0] : mainContainers;
    if (!mainContainer) return;

    // Top Section
    mainContainer.append({
      tagName: 'div',
      attributes: { 'data-zone': 'top' },
      droppable: true,
      ...this.getContainerConfig(),
      style: {
        'grid-column': '1 / -1',
        padding: '20px',
        'background-color': '#f0f0f0',
        'border-bottom': '1px solid #ddd',
        'min-height': '80px',
      },
    });

    // Left Panel
    mainContainer.append({
      tagName: 'div',
      attributes: { 'data-zone': 'left' },
      droppable: true,
      ...this.getContainerConfig(),
      style: {
        padding: '20px',
        'background-color': '#f9f9f9',
        'border-right': '1px solid #ddd',
        'min-height': '300px',
      },
    });

    // Center Content
    mainContainer.append({
      tagName: 'div',
      attributes: { 'data-zone': 'center' },
      droppable: true,
      ...this.getContainerConfig(),
      style: {
        padding: '20px',
        'background-color': '#fff',
      },
    });

    // Right Panel
    mainContainer.append({
      tagName: 'div',
      attributes: { 'data-zone': 'right' },
      droppable: true,
      ...this.getContainerConfig(),
      style: {
        padding: '20px',
        'background-color': '#f9f9f9',
        'border-left': '1px solid #ddd',
        'min-height': '300px',
      },
    });

    // Bottom Section
    mainContainer.append({
      tagName: 'div',
      attributes: { 'data-zone': 'bottom' },
      droppable: true,
      ...this.getContainerConfig(),
      style: {
        'grid-column': '1 / -1',
        padding: '20px',
        'background-color': '#f0f0f0',
        'border-top': '1px solid #ddd',
        'min-height': '60px',
      },
    });

    this.editor.refresh();
  }

  private getContainerConfig() {
    return {
      selectable: true, // vẫn click được để drop
      hoverable: true,
      highlightable: true,
      draggable: false, // ✅ khoá drag
      removable: false, // ✅ khoá xoá
      copyable: false, // ✅ khoá copy
      resizable: false, // ✅ khoá resize
      badgable: false,
      stylable: false, // ✅ không cho chỉnh style layout
      editable: false, // ✅ không cho edit text RTE
      toolbar: [], // ✅ không show icon move/delete
    };
  }
  private async loadBlockLibrary() {
    const blocks: WidgetBlock[] = await firstValueFrom(this.widgetBlocksService.findAll());

    blocks.forEach((b) => GrapesJSBlocksUtils.addDbBlock(this.editor, b));
  }

  private addBlocks() {
    // Add Swiper Slider blocks
    GrapesJSBlocksUtils.addSwiperSliderBlocks(this.editor);
  }

  hasFormChanged(): boolean {
    const currentFormValue = this.getFormValueAsComparable();
    return this.initialFormValue !== currentFormValue;
  }

  private extractZones(): ContentLayoutZone[] {
    const zoneNames = ['top', 'left', 'center', 'right', 'bottom'];
    const zones: ContentLayoutZone[] = [];

    // Get wrapper and find main container by id
    const wrapper = this.editor.getWrapper();
    if (!wrapper) return zones;

    const mainContainer = wrapper.components().find((c: any) => {
      const attrs = c.getAttributes();
      return attrs['id'] === 'main-container';
    });
    if (!mainContainer) return zones;

    // Get all zone containers from main container children
    const zoneComponents = mainContainer.components();
    // Get all CSS from editor
    const allCss = this.editor.getCss() || '';

    zoneNames.forEach((zoneName) => {
      // Find zone container by data-zone attribute
      const zoneComponent = zoneComponents.find((c: any) => {
        const attrs = c.getAttributes();
        return attrs['data-zone'] === zoneName;
      });

      if (zoneComponent) {
        // Get HTML of children inside the zone (not the zone container itself)
        const children = zoneComponent.components();
        const childrenHtml = children.map((child: any) => child.toHTML()).join('\n');
        const html = childrenHtml || '';

        // Collect all selectors (classes, IDs, tags) used in ONLY this zone
        const relevantSelectors = new Set<string>();
        const collectSelectors = (component: any) => {
          // Collect classes
          const classes = component.getClasses();
          if (classes && Array.isArray(classes)) {
            classes.forEach((cls: string) => relevantSelectors.add(`.${cls}`));
          }

          // Collect IDs
          const id = component.getId?.();
          if (id) {
            relevantSelectors.add(`#${id}`);
          }

          // Collect tag names
          const tagName = component.get('tagName');
          if (tagName) {
            relevantSelectors.add(tagName);
          }

          // Recursively collect from children
          const children = component.components();
          if (children) {
            children.forEach((child: any) => collectSelectors(child));
          }
        };

        collectSelectors(zoneComponent);

        // Parse CSS and extract rules relevant to this zone only
        const cssParts = allCss.split('}').filter((part: string) => part.trim());
        const relevantCssRules: string[] = [];

        cssParts.forEach((rulePart: string) => {
          const [selector, styles] = rulePart.split('{');
          if (!selector || !styles) return;

          const trimmedSelector = selector.trim();

          // Check if selector matches any relevant selector in this zone
          const isRelevant = Array.from(relevantSelectors).some((sel: string) => {
            // Match exact class/ID
            if (trimmedSelector.includes(sel)) return true;
            // Match tag names (div, section, img, etc)
            if (sel.match(/^[a-z]+$/) && trimmedSelector.split(/[\s,.:>#\[\]]/)[0] === sel) return true;
            return false;
          });

          // Include media queries that might affect this zone
          const isMediaQuery = trimmedSelector.includes('@media');

          // Include global/framework rules
          const isGlobalRule =
            trimmedSelector.includes('@keyframes') ||
            trimmedSelector.includes('@font-face') ||
            trimmedSelector === ':root' ||
            trimmedSelector.includes('*');

          if (isRelevant || isMediaQuery || isGlobalRule) {
            relevantCssRules.push(`${selector}{${styles}}`);
          }
        });

        const css = relevantCssRules.join('\n');

        zones.push({
          name: zoneName,
          html,
          css: css.trim(),
        });
      }
    });

    return zones;
  }

  onSubmit() {
    if (!this.contentLayoutForm.valid) {
      this.utils.markFormGroupTouched(this.contentLayoutForm);
      return;
    }

    // Check if there are any changes
    if (!this.hasFormChanged()) {
      return;
    }

    const wrapper = this.editor.getWrapper();
    if (!wrapper) return;

    const projectData = this.editor.getProjectData();

    let { name, imageId, slug, description, appSource, platform, startDate, endDate } = this.contentLayoutForm.value;

    // Extract zones (top, left, center, right, bottom)
    const zones = this.extractZones();

    let dataTransfer = new DataTransfer();

    // Validate and add imageFile
    if (this.imageFile) {
      dataTransfer.items.add(this.imageFile);
    }
    const files: FileList = dataTransfer.files;

    if (this.isNonEndDate) {
      endDate = null;
    }
    if (this.isPage) {
      slug = '/pages' + slug;
    }

    const contentLayout2Create: ContentLayout2Create = {
      imageId,
      name,
      slug,
      appSource,
      platform,
      description,
      startDate,
      endDate,
      projectData: JSON.stringify(projectData),
      zones: JSON.stringify(zones),
    };

    if (this.contentLayout) {
      const contentLayout2Update: ContentLayout2Update = {
        ...contentLayout2Create,
        _id: this.contentLayout._id, // Thêm thuộc tính _id
      } as ContentLayout2Update;

      this.updateContentLayout(files, contentLayout2Update);
      return;
    }

    this.createContentLayout(files, contentLayout2Create);
  }

  createContentLayout(files: FileList, contentLayout2Create: ContentLayout2Create) {
    this.contentLayoutService.processCreateContentLayout(files, contentLayout2Create).subscribe({
      next: (res: ContentLayout) => {
        if (res) {
          toast.success('Content Layout added successfully');
          const updatedState = { ...history.state, contentLayout: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          this.initialFormValue = this.getFormValueAsComparable();
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  updateContentLayout(files: FileList, contentLayout2Update: ContentLayout2Update) {
    this.contentLayoutService.processUpdateContentLayout(files, contentLayout2Update).subscribe({
      next: (res: ContentLayout) => {
        if (res) {
          toast.success('Content Layout updated successfully');
          const updatedState = { ...history.state, contentLayout: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          this.initialFormValue = this.getFormValueAsComparable();
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  checkDateDisableDate(idx: number): (current: Date) => boolean {
    // Nếu là picker đầu tiên, vô hiệu hóa các ngày nhỏ hơn ngày hiện tại.
    if (idx === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return (current: Date): boolean => current < today;
    }

    // Với các picker khác, lấy ngày đã chọn tại picker trước đó.

    const previousDateValue = this.contentLayoutForm.get('startDate')?.value;
    if (previousDateValue) {
      const minDate = new Date(previousDateValue);
      // Tăng thêm 1 ngày
      minDate.setDate(minDate.getDate() + 1);
      minDate.setHours(0, 0, 0, 0);
      return (current: Date): boolean => current < minDate;
    }

    // Nếu không có giá trị picker trước, dùng ngày hiện tại làm mốc.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (current: Date): boolean => current < today;
  }

  selectIsEndDate() {
    const endDateControl = this.contentLayoutForm.get('endDate');
    this.isNonEndDate ? endDateControl?.clearValidators() : endDateControl?.setValidators(Validators.required);
    endDateControl?.updateValueAndValidity();
  }

  onAppSourceChange(event: any) {
    this.platforms = PLATFORM_DEFAULT_APP_SOURCES_OPTIONS;
    if (event === APP_SOURCE.POS) {
      this.platforms = this.platforms.filter(
        (p) => p.value !== PLATFORM_DEFAULT_APP_SOURCE.WINDOW_APP && p.value !== PLATFORM_DEFAULT_APP_SOURCE.APP,
      );
      this.contentLayoutForm.patchValue({ platform: PLATFORM_DEFAULT_APP_SOURCE.WEB });
    } else if (event === APP_SOURCE.DRIVER) {
      this.platforms = this.platforms.filter(
        (p) => p.value !== PLATFORM_DEFAULT_APP_SOURCE.WINDOW_APP && p.value !== PLATFORM_DEFAULT_APP_SOURCE.WEB,
      );
      this.contentLayoutForm.patchValue({ platform: PLATFORM_DEFAULT_APP_SOURCE.APP });
    }
  }

  preview() {
    this.editor.runCommand('preview');
  }

  backPage(): void {
    window.history.back();
  }
}
