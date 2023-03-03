import { useRef, useState } from 'react';
import { saveFile } from '../../../util';
import FileSelector from '../../fileSelector';

export default function TransformNative() {
  const [file, setFile] = useState<string | ArrayBuffer | null>(null);

  const resultRef = useRef<any>();
  const naviteRef = useRef<any>();
  const trRef = useRef<any>();
  const pinyinRef = useRef<any>();
  const errorRef = useRef<any>([]);

  const readFile = (file: any, ref: any) => {
    var reader = new FileReader();
    reader.readAsText(file, 'utf8');
    reader.onload = () => {
      const f = JSON.parse(reader.result as string)
      console.log('f: ', f);
      ref.current = f;
    };
  }

  const onChange = (file: any) => {
    readFile(file, naviteRef)
  };

  const onChangeTr = (file: any) => {
    readFile(file, trRef);
  }

  const onChangePinyin = (file: any) => {
    readFile(file, pinyinRef);
  }

  const onStart = () => {
    if (!naviteRef.current) {
      console.error('请选择navite文件');
      return;
    }

    const emojiData = {} as any;
    const emojis = {} as any;

    // const enzh = Object.keys(trRef.current);

    // 1. 解析emoji-mart的navite.json文件

    // 1.1 获取所有的emoji
    const { emojis: naviteEmojis, categories: naviteCategories } = naviteRef.current;
    Object.entries(naviteEmojis).forEach(([key, value] : [key: any, value: any]) => {
      // 获取keywords
      let keywordLists = [];

      const zhongWen = [] as any[];
      const pinyin = [] as any[];
      const initialism = [] as any[];
      const english = [] as any[];
      const newEmoji = {
        value: value.name,
        emoji: value.skins[0].native,
        code: `U+${value.skins[0].unified.toUpperCase()}`,
        id: key,
        keywords: [] as any[],
      };
      // keywords
      const keywords = value.keywords as string[];
      keywords.forEach((word) => {
        const w = word.replaceAll(/[-|_|]+/g, ' ');
        const zh = trRef.current[w];
        if (zh) {
          // 中文keyword
          zhongWen.push(zh);
          // 拼音keyword
          if (!pinyinRef.current[zh]) {
            errorRef.current.push(zh);
          } else {
            pinyin.push(pinyinRef.current[zh][0]);
            // 拼音首字母
            initialism.push(pinyinRef.current[zh][1]);
          }
          // 英文keyword
          english.push(word);
        } else {
          errorRef.current.push(zh);
        }
      });

      // name也可以作为keyword
      const names = [...value['name'].split(/[-|_|\s]+/), value['name']];
      names.forEach((w: string) => {
        const zh = trRef.current[w];
        if (zh) {
          // 中文keyword
          zhongWen.push(zh);
          // 拼音keyword
          if (!pinyinRef.current[zh]) {
            errorRef.current.push(zh);
          } else {
            pinyin.push(pinyinRef.current[zh][0]);
            // 拼音首字母
            initialism.push(pinyinRef.current[zh][1]);
          }
          // 英文keyword
          english.push(w);
        } else {
          errorRef.current.push(zh);
        }
      });

      keywordLists = [zhongWen, pinyin, initialism, english];

      newEmoji.keywords = keywordLists;

      emojis[key] = newEmoji;
    });

    // 根据目录类型将emoji分组
    naviteCategories.forEach((group: any) => {
      const newGroup = {
        type: '',
        title: '',
        info: [] as any[],
      } 
      group.emojis.forEach((emoji: any) => {
        if (emojis[emoji]) { 
          newGroup.info.push(emojis[emoji]);
        } else {
          errorRef.current.push(emoji);
        }
      });
      emojiData[group.id] = newGroup;
    })

    console.log(emojiData);
    resultRef.current = emojiData;
  }

  const onSave = () => {
    saveFile('emoji.json', resultRef.current)
  }


  return (
    <>
      <td>
        {'将navite 中的emoji 分组'}
        <FileSelector onChange={onChange} />
      </td>
      <td>
        <p>
          <label>{'选择翻译文件'}</label>
          <FileSelector onChange={onChangeTr} />
        </p>
        <p>
          <label>{'选择拼音文件'}</label>
          <FileSelector onChange={onChangePinyin} />
        </p>
      </td>
      <td>
        <p>
          <button type="button" onClick={onStart}>{'开始'}</button>
        </p>
      </td>
      <td></td>
      <td>
        <p>
          <button type="button" onClick={onSave}>{'保存文件'}</button>
        </p>
      </td>
    </>
  );
}