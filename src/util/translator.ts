import { pinyin } from 'pinyin-pro';

enum ETranslateType {
  // 英文翻译成中文
  EnToZh,
  // 中文翻译成拼音
  ZhToPin,
  // 获取中文首字母
  ZhToInitial,
  // 中文多音字
  Polyphones,
}

// 英文翻译成中文
class EnToZh {
  translate(word: string) {
    return [''];
  }
}

/**
 * 中文翻译成拼音
 */
class ZhToPin {
  translate(word: string) {
    const py = pinyin(word, { toneType: 'none' });
    return [py];
  }
}

// 获取中文首字母
class ZhToInitial {
  translate(word: string) {
    const py = pinyin(word, { toneType: 'none' });
    let initials = '';
    // 去除空格的pingyin
    let str = '';
    py.split(' ').forEach(value => {
      str += value;
      initials += value.substring(0, 1);
    });
    return [initials];
  }
}

// 多音字
class Polyphones {
  translate(word: string): string[] {
    const res = [] as string[];
    let pattern = new RegExp('[\u4E00-\u9FA5]');
    for (let i = 0; i < word.length; i++) {
      const singleWord = word.charAt(i);
      if (pattern.test(singleWord)) {
        const py = pinyin(singleWord, { multiple: true, toneType: 'none' });
        py.split(' ').forEach(value => {
          res.push(value.trim());
        });
      }
    }
    return res;
  }
}

class translator {
  tr: ZhToPin | ZhToInitial | Polyphones | EnToZh;

  constructor(type: ETranslateType) {
    this.tr = new EnToZh();
    if (type === ETranslateType.ZhToPin) {
      this.tr = new ZhToPin();
    } else if (type === ETranslateType.ZhToInitial) {
      this.tr = new ZhToInitial();
    } else if (type === ETranslateType.Polyphones) {
      this.tr = new Polyphones();
    } else if (type === ETranslateType.EnToZh) {
      this.tr = new EnToZh();
    }
  }
  translate(word: string) {
    return this.tr.translate(word);
  }
}

export { ETranslateType, translator };
