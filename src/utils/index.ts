export const download = (url: string, fileName?: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || '';
  a.target = '_blank?'
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
