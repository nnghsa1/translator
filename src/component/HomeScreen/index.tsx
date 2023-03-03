import { PureComponent, useEffect, useRef, useState } from 'react';
import { saveFile, translator } from '../../util';
import { EStatus } from '../../util/const';
import { ETranslateType } from '../../util/translator';
import FileSelector from '../fileSelector';

import './index.css';
import TransformNative from './TransformNative';
import ZhToPinyin from './ZhToPinyin';


function RenderEnToZh() {
  const onChange = (file: any, type: EFileType) => {
    var reader = new FileReader();
    reader.readAsText(file, 'utf8');
    reader.onload = () => {
      console.log(reader.result);
      // 英文json
      if (type === EFileType.En) {
      }
    };
  };
  return (
    <>
      <td>
        {'英文翻译中文'}
        <FileSelector onChange={file => onChange(file, EFileType.En)} />
      </td>
      <td>
        <p>
          <input type="checkbox" name="subscribe" value="newsletter" />
          <label>{'翻译成中文'}</label>
        </p>
        <p>
          <input type="checkbox" name="subscribe" value="newsletter" />
          <label>{'翻译成拼音'}</label>
        </p>
        <p>
          <input type="checkbox" name="subscribe" value="newsletter" />
          <label>{'拼音首字母'}</label>
        </p>
      </td>
      <td>
        <p>
          <button type="button">{'开始'}</button>
        </p>
        <p>
          <button type="button">{'暂停'}</button>
        </p>
        <p>
          <button type="button">{'停止'}</button>
        </p>
      </td>
      <td></td>
      <td>
        <textarea />
      </td>
    </>
  );
}

// 多音字
function Polyphones() {
  const onChange = (file: any, type: EFileType) => {
    var reader = new FileReader();
    reader.readAsText(file, 'utf8');
    reader.onload = () => {
      console.log(reader.result);
      // 英文json
      if (type === EFileType.En) {
      }
    };
  };
  return (
    <>
      <td>
        {'多音字'}
        <FileSelector onChange={file => onChange(file, EFileType.En)} />
      </td>
      <td>
        <p>{'说明：将文件中所有的中文 ”逐字翻译" 拼音'}</p>
      </td>
      <td>
        <p>
          <button type="button">{'开始'}</button>
        </p>
        <p>
          <button type="button">{'暂停'}</button>
        </p>
        <p>
          <button type="button">{'停止'}</button>
        </p>
      </td>
      <td>$80</td>
      <td>
        <textarea />
      </td>
    </>
  );
}

enum EFileType {
  En,
  ZhToPin,
}

interface IHomeComponentProps { }
export default class HomeScreen extends PureComponent {
  constructor(props: IHomeComponentProps) {
    super(props);
    this.state = {};
  }

  onChange = (file: any, type: EFileType) => {
    var reader = new FileReader();
    reader.readAsText(file, 'utf8');
    reader.onload = () => {
      console.log(reader.result);
      // 英文json
      if (type === EFileType.En) {
      }
    };
  };

  render() {
    return (
      <table>
        <tr>
          <td>{'选择json文件'}</td>
          <td>{'参数配置'}</td>
          <td>{'按钮'}</td>
          <td>{'进度'}</td>
          <td>{'文件保存'}</td>
        </tr>
        <tr>
          <RenderEnToZh />
        </tr>
        <tr>
          <ZhToPinyin />
        </tr>
        <tr>
          <Polyphones />
        </tr>
        <tr>
        <TransformNative/>
        </tr>
      </table>
    );
  }
}
