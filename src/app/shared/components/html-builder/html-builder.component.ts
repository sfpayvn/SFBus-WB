import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import grapesjs, { Editor } from 'grapesjs';
import presetWebpage from 'grapesjs-preset-webpage';
import basicBlocks from 'grapesjs-blocks-basic';
import forms from 'grapesjs-plugin-forms';
import navbar from 'grapesjs-navbar';
import customCode from 'grapesjs-custom-code';
import tabs from 'grapesjs-tabs';

@Component({
  selector: 'app-html-builder',
  templateUrl: './html-builder.component.html',
  styleUrls: ['./html-builder.component.scss'],
})
export class HtmlBuilderComponent implements AfterViewInit, OnDestroy {
  private editor!: Editor;

  ngAfterViewInit(): void {
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
      ],

      pluginsOpts: {
        [basicBlocks as any]: {
          flexGrid: true, // ✅ có flex/grid layout
        },
      },
    });
    this.addBlocks();

    // ✅ refresh để canvas tính lại size
    setTimeout(() => this.editor.refresh(), 0);
    setTimeout(() => {
      this.editor.refresh();
    }, 200);
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  private addBlocks() {
    const bm = this.editor.BlockManager;

    bm.add('my-text', {
      label: 'Text',
      category: 'Basic',
      content: `<div style="padding:12px"><h3>Title 1</h3><p>Description...</p></div>`,
    });

    bm.add('my-image', {
      label: 'Image',
      category: 'Basic',
      content: `<img src="https://via.placeholder.com/600x240" style="max-width:100%; border-radius:12px" />`,
    });

    bm.add('my-slider', {
      label: 'Slider (simple)',
      category: 'Widgets',
      content: `
        <section class="my-slider">
          <div class="my-slide"><h3>Slide 1</h3><p>Text 1</p></div>
          <div class="my-slide"><h3>Slide 2</h3><p>Text 2</p></div>
        </section>
        <style>
          .my-slider{display:flex;gap:12px;overflow:auto;padding:12px;}
          .my-slide{min-width:240px;border:1px solid #eee;border-radius:12px;padding:14px;}
        </style>
      `,
    });
  }

  save() {
    const selected = this.editor.getSelected();
    if (!selected) return;

    const componentJson = selected.toJSON(); // ✅ block definition
    const html = selected.toHTML();
    const css = this.editor.getCss(); // đơn giản (sau này tối ưu css riêng)
    console.log('Component JSON:', componentJson);
    console.log('HTML:', html);
    console.log('CSS:', css);
  }

  preview() {
    this.editor.runCommand('preview');
  }
}
