import React, { useState, useRef, useEffect } from 'react';
import { Collapse } from 'reactstrap';
import { Button, Icon } from '@/components';
import Create, { styles } from './styles';
import { snackBar } from '@/utils/snackbar';

function CollapseShow() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('Lihat Contoh');
  const [disabled, setDisabled] = useState(false);

  const textToCopyRef = useRef(null);

  const toggle = () => setIsOpen(!isOpen);
  const onEntered = () => setStatus('Tutup Contoh');
  const onExited = () => setStatus('Lihat Contoh');

  const handleCopy = (): void => {
    if (!textToCopyRef.current) return;
    setDisabled(true);
    const text = textToCopyRef.current.innerText;
    navigator.clipboard.writeText(text)
      .then(() => {
        setTimeout(() => setDisabled(false), 2000); 
        snackBar('success', 'success copy', 'top-right', 1500, -120);
      })
      .catch(() => {
      //  console.error("Failed to copy text:", err);
      });
  };

  useEffect(() => {
    // Focus the button on collapse open to improve accessibility
    if (isOpen) {
      const button = document.querySelector('[data-testid=\'copy-button\']'); // target button with data-testid
      if (button) {
        (button as HTMLButtonElement).focus();
      }
    }
  }, [isOpen]);

  return (
    <>
      <span
        className="text-primary text-decoration-underline"
        style={styles.titleExample}
        onClick={toggle}
      >
        {status}
      </span>
      <Collapse
        isOpen={isOpen}
        onEntered={onEntered}
        onExited={onExited}
        style={styles.Collapse}
      >
        <Create.Container>
          <Create.ContainerContent>
            <Create.ContainerTitle ref={textToCopyRef}>
              <Create.Title>Nama: </Create.Title>[Nama Penerima]
              <br />
              <Create.Title>Kontak: </Create.Title>[Kontak Penerima]
              <br /> <Create.Title>Provinsi: </Create.Title>[contoh: Jawa Barat]
              <br />
              <Create.Title>Kota/Kabupaten: </Create.Title>[contoh: Kota
              Bandung]
              <br />
              <Create.Title>Kecamatan: </Create.Title>[contoh: Sukajadi]
              <br />
              <Create.Title>Kelurahan: </Create.Title>[contoh: Cipedes]
              <br />
              <Create.Title>Kodepos:</Create.Title> [contoh: 40161] <br />
              <Create.Title>Alamat:</Create.Title> [Dapat diisi dengan no.
              rumah/bangunan, patokan, jalan]
              <br />
              <Create.Title>Pembayaran:</Create.Title> [COD/NON-COD]
              <br />
              <Create.Title>Catatan:</Create.Title> <br /> <br />
              <Create.Title> Produk:</Create.Title>
              <br />
              1. ⁠
              <span style={{ marginLeft: '5px' }}>
                [Jumlah * Nama Produk/SKU]
              </span>
              <br /> 2.
              <span style={{ marginLeft: '5px' }}>
                [Jumlah * Nama Produk/SKU]
              </span>
            </Create.ContainerTitle>
            <Button 
              disabled={disabled}
              onClick={handleCopy} 
              type="button" 
              style={styles.Button} 
              className="d-none d-sm-flex" 
              data-testid="copy-button"
            >
              <span style={styles.TitleButton}>Salin</span>
              <Icon name="clipboard" style={styles.Icon}/>
            </Button>
          </Create.ContainerContent>
        </Create.Container>
      </Collapse>
    </>
  );
}

export default CollapseShow;
