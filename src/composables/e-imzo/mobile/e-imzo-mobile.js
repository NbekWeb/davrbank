/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*eslint-disable*/

export function EIMZOMobile(site_id, qrcode_element) {

    this.site_id = site_id;

    let qrcode = new QRCode(document.getElementById(qrcode_element), {
        width: 250,
        height: 250
    });

    this.makeQRCode = function (doc_num, text) {

        if (!this.site_id) {
            return;
        }
        if (!doc_num) {
            return;
        }
        if (!text) {
            return;
        }

        const hasher = new GostHash();
        const text_hash = hasher.gosthash(text);

        let code = this.site_id + doc_num + text_hash;
        const crcer = new CRC32();

        const crc32 = crcer.calcHex(code);
        code += crc32;

        qrcode.makeCode(code);

        return [text_hash, code];

    };


}
