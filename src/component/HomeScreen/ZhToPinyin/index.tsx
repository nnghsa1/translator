import { useEffect, useRef, useState } from 'react';
import { saveFile, translator } from '../../../util';
import { EStatus } from '../../../util/const';
import { ETranslateType } from '../../../util/translator';
import FileSelector from '../../fileSelector';

// 中文翻译成拼音
export default function ZhToPinyin() {
  const [file, setFile] = useState<string | ArrayBuffer | null>(null);
  const [status, setStatus] = useState<EStatus>(EStatus.stop);
  const [total, setTotal] = useState<number>(0);
  const [completeNum, setCompleteNum] = useState<number>(0);

  const progress = useRef(0);
  const resultRef = useRef({});

  const onChange = (file: any) => {
    var reader = new FileReader();
    // reader.readAsText(file, 'utf8');
    reader.onload = () => {
      const f = Object.values(JSON.parse(reader.result as string)) as string[];
      setTotal(f.length);
      setFile(reader.result);
    };
  };

  const run = () => {
    const batch = 100;
    let i = 0;
    const f = Object.values(JSON.parse(file as string)) as string[];
    const res = {} as any;
    const tr = new translator(ETranslateType.ZhToPin);

    // 提取中文词语
    while (i < batch && progress.current < f.length) {
      const str = tr.translate(f[progress.current])[0];
      const py = str.replaceAll(' ', '');
      let initial = '';
      str.split(' ').forEach((word) => {
        initial += word.substring(0, 1);
      })
      res[f[progress.current]] = [py, initial];
      i++;
      progress.current++;
    }
    resultRef.current = { ...resultRef.current, ...res };
    setCompleteNum(progress.current);
    if (status !== EStatus.start || progress.current >= f.length) {
      return;
    }
    requestAnimationFrame(run);
  }

  const onStart = () => {
    if (EStatus.stop === status) {
      resultRef.current = {};
    }
    setStatus(EStatus.start);
  };

  const onPause = () => {
    setStatus(EStatus.pause);
  };

  const onStop = () => {
    progress.current = 0;
    setCompleteNum(0);
    setStatus(EStatus.stop);
    resultRef.current = {}
  };

  const onSave = () => {
    saveFile('ZhToPin.json', resultRef.current)
  }

  useEffect(() => {
    if (file && EStatus.start === status) {
      requestAnimationFrame(run);
    }
  }, [status]);

  return (
    <>
      <td>
        {'中文翻译拼音'}
        <FileSelector onChange={onChange} />
      </td>
      <td>
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
          <button type="button" onClick={onStart}>{'开始'}</button>
        </p>
        <p>
          <button type="button" onClick={onPause}>{'暂停'}</button>
        </p>
        <p>
          <button type="button" onClick={onStop}>{'停止'}</button>
        </p>
      </td>
      <td>{completeNum}/{total}</td>
      <td>
      <p>
          <button type="button" onClick={onSave}>{'保存文件'}</button>
        </p>
      </td>
    </>
  );
}