import { toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';

export function printToFile(node, name) {
  // console.log('printToFile');
  const imageName = `${name}.png`
  toBlob(node)
    .then(function(blob) {
      if (window.saveAs) {
        window.saveAs(blob, imageName);
      } else {
        saveAs(blob, imageName);
      }
    });
}
