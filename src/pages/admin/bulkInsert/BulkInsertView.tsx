import { resolve, useInjection } from 'inversify-react';
import React, { useRef } from 'react';
import DataInsertService from './../../../services/DataInsertService';
import DialogService from './../../../services/DialogService';
import { FormEvent } from 'react';
import { ViewTemplate } from '../../../layout/ViewTemplate';
import { BasePage } from '../../BasePage';

export default class BulkInsertView extends BasePage<any, any> {
  @resolve(DataInsertService)
  private service: DataInsertService;
  constructor(props: any) {
    super(props, true, 'Data Insert')
  }
  render() {
    return (
      <ViewTemplate title="Data Insert" back="/admin">
        <div className="row">
          <div className="col-md-3">
            <BulkInsertItem name="Employee" action={this.service.insertEmployeesBulk} />
          </div>
        </div>
      </ViewTemplate>
    )
  }
}

const BulkInsertItem: React.FC<{ name: string, action(file: File): Promise<any> }> =
  function ({ name, action }) {
    const dialog = useInjection(DialogService);
    const fileRef = useRef<HTMLInputElement>();
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!fileRef.current)
        return;
      const file = fileRef.current.files ? fileRef.current.files[0] : null;
      if (!file) {
        dialog.showError('File Required', 'Please attach file');
        return;
      }
      const ok = await dialog.showConfirm('Upload ' + file.name, 'Continue upload data?')
      if (!ok) {
        return;
      }
      action(file)
        .then(() => dialog.showInfo('Success', 'Upload success'))
        .catch((err) => dialog.showError('Upload failed', err));
    }
    return (
      <div className="card">
        <div className="card-header">
          {name}
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit} >
            <p>Select CSV file</p>
            <input type="file" ref={fileRef as any} accept=".csv" required autoComplete="off" />
            <div className="mb-2" />
            <input type="submit" value="Submit" className="btn btn-primary" />
          </form>
        </div>
      </div>
    )
  }