import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Setting } from '@rsApp/modules/settings/model/setting.model';
import { Utils } from '@rsApp/shared/utils/utils';
import { toast } from 'ngx-sonner';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-default-setting-detail-dialog',
  templateUrl: './default-setting-detail-dialog.component.html',
  styleUrls: ['./default-setting-detail-dialog.component.scss'],
  standalone: false,
})
export class DefaultSettingDetailDialogComponent implements OnInit, AfterViewInit {
  @ViewChild(QuillEditorComponent) quillEditor!: QuillEditorComponent;

  mainForm!: FormGroup;
  mode: 'create' | 'edit' = 'create';
  setting!: Setting;
  valueEditorMode: 'editor' | 'json' = 'editor';

  editorModules: any = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      [
        { color: ['#000000', '#e60000', '#ff9900', '#ffff00', '#00b050', '#00b0f0', '#4a90e2', '#9900ff'] },
        { background: ['#ffffff', '#f3f3f3', '#ffff00', '#ffff99', '#00ff00', '#99ffff', '#0099ff', '#ff99ff'] },
      ],
      ['bold', 'italic', 'underline'],
      [{ align: [] }],
      ['image'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    public dialogRef: MatDialogRef<DefaultSettingDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.setting = data.setting;
    this.mode = data.mode;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    if (this.setting.value) {
      // Detect initial mode based on content
      const initialMode = this.detectContentMode(this.setting.value);
      this.valueEditorMode = initialMode;

      if (initialMode === 'editor' && this.quillEditor) {
        setTimeout(() => {
          const quillInstance = this.quillEditor.quillEditor;
          if (quillInstance && quillInstance.root) {
            quillInstance.root.innerHTML = this.setting.value;
          }
        }, 100);
      } else {
        // For JSON mode, set value in form control
        this.mainForm.get('value')?.setValue(this.setting.value, { emitEvent: false });
      }
    }
  }

  initForm(): void {
    this.mainForm = this.fb.group({
      name: [this.setting.name || '', [Validators.required, Validators.minLength(2)]],
      value: ['', [Validators.required]],
      description: [this.setting.description || ''],
      groupName: [this.setting.groupName || '', [Validators.required]],
    });
  }

  /**
   * Strip HTML tags from content
   */
  stripHtmlTags(html: string): string {
    if (!html) return '';
    // Remove all HTML tags
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Detect if content is HTML or JSON
   * Returns 'editor' for HTML, 'json' for plain text/JSON
   */
  detectContentMode(content: string): 'editor' | 'json' {
    if (!content) return 'editor';

    const trimmed = content.trim();
    // Check if it starts with HTML tags
    if (trimmed.startsWith('<') && trimmed.includes('>')) {
      return 'editor';
    }
    // Check if it contains HTML tags anywhere
    if (/<[^>]*>/g.test(trimmed)) {
      return 'editor';
    }
    // Everything else is JSON/plain text mode
    return 'json';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  clearValue(controlName: string): void {
    this.mainForm.get(controlName)?.setValue('');
  }

  changeValueMode(newMode: 'editor' | 'json'): void {
    const currentValue = this.mainForm.get('value')?.value;

    // Get content from current mode before switching
    let contentToPreserve = '';
    if (this.valueEditorMode === 'editor' && this.quillEditor) {
      const quillInstance = this.quillEditor.quillEditor;
      if (quillInstance && quillInstance.root) {
        contentToPreserve = quillInstance.root.innerHTML;
      }
    } else if (this.valueEditorMode === 'json') {
      contentToPreserve = currentValue || '';
    }

    // Switch mode
    this.valueEditorMode = newMode;
    setTimeout(() => {
      // Load content in new mode
      if (newMode === 'editor' && this.quillEditor) {
        const quillInstance = this.quillEditor.quillEditor;
        if (quillInstance && quillInstance.root) {
          if (contentToPreserve.includes('<')) {
            // It's HTML
            quillInstance.root.innerHTML = contentToPreserve;
          } else {
            // It's plain text
            quillInstance.setText(contentToPreserve);
          }
        }
      } else if (newMode === 'json') {
        // Set value in textarea for JSON mode - strip HTML tags
        const cleanedContent = this.stripHtmlTags(contentToPreserve);
        this.mainForm.get('value')?.setValue(cleanedContent, { emitEvent: false });
      }
    }, 50);
  }

  onSubmit(): void {
    if (!this.mainForm.valid) {
      this.utils.markFormGroupTouched(this.mainForm);
      toast.error('Please fill in all required fields');
      return;
    }

    const formValue = this.mainForm.getRawValue();
    let finalValue = formValue.value;

    if (this.valueEditorMode === 'editor' && this.quillEditor) {
      const quillInstance = this.quillEditor.quillEditor;
      if (quillInstance && quillInstance.root) {
        finalValue = quillInstance.root.innerHTML;
      }
    }

    const settingToSave: Setting = {
      name: formValue.name,
      value: finalValue,
      description: formValue.description,
      groupName: formValue.groupName,
    };

    this.dialogRef.close(settingToSave);
  }
}
