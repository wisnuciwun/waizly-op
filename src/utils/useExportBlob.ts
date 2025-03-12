export const UseExportBlob = (data: any, fileName: string) => {
  const blob = new Blob([data], {type: 'application/octet-stream'});
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};
