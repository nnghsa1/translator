const createBlob = (file: any) => {
  const blob = new Blob([JSON.stringify(file)]);
  return blob;
}

const saveFile = (filename: string, file: any) => {
  var link = document.createElement('a');
  //设置下载的文件名
  link.download = filename;
  link.style.display = 'none';
  //设置下载路径
  link.href = URL.createObjectURL(createBlob(file));
  //触发点击
  document.body.appendChild(link);
  link.click();
  //移除节点
  document.body.removeChild(link);
}

export {
  saveFile,
}