import React, { useState } from "react";

// Kamus untuk mengkonversi huruf kapital ke angka
const kamusHurufKapital = {
  A: 0,
  B: 1,
  C: 1,
  D: 1,
  E: 2,
  F: 3,
  G: 3,
  H: 3,
  I: 4,
  J: 5,
  K: 5,
  L: 5,
  M: 5,
  N: 5,
  O: 6,
  P: 7,
  Q: 7,
  R: 7,
  S: 7,
  T: 7,
  U: 8,
  V: 9,
  W: 9,
  X: 9,
  Y: 9,
  Z: 9,
};

// Kamus untuk mengkonversi huruf kecil ke angka
const kamusHurufKecil = {
  a: 9,
  b: 8,
  c: 8,
  d: 8,
  e: 7,
  f: 6,
  g: 6,
  h: 6,
  i: 5,
  j: 4,
  k: 4,
  l: 4,
  m: 4,
  n: 4,
  o: 3,
  p: 2,
  q: 2,
  r: 2,
  s: 2,
  t: 2,
  u: 1,
  v: 0,
  w: 0,
  x: 0,
  y: 0,
  z: 0,
  " ": 0, // Karakter spasi
};

// Kamus untuk mengkonversi angka kembali ke huruf
const kamusAngkaKeHuruf = {
  0: "A",
  1: "B",
  2: "E",
  3: "F",
  4: "I",
  5: "J",
  6: "O",
  7: "P",
  8: "U",
  9: "V",
};

const App = () => {
  // State untuk menyimpan input dan hasil setiap langkah
  const [kalimatInput, setKalimatInput] = useState("");
  const [hasilAngka, setHasilAngka] = useState("");
  const [hasilOperasi, setHasilOperasi] = useState(0);
  const [urutanOperasi, setUrutanOperasi] = useState("");
  const [hasilHuruf, setHasilHuruf] = useState("");
  const [penjelasanHuruf, setPenjelasanHuruf] = useState("");
  const [angkaAntara, setAngkaAntara] = useState("");
  const [hasilHurufBaru, setHasilHurufBaru] = useState("");
  const [penjelasanHurufBaru, setPenjelasanHurufBaru] = useState("");
  const [hasilAkhir, setHasilAkhir] = useState("");
  const [penjelasanAkhir, setPenjelasanAkhir] = useState("");

  // Langkah 1: Mengkonversi kalimat input menjadi angka sesuai kamus
  const konversiKeAngka = (teks) => {
    return teks
      .split("")
      .map((karakter) => {
        if (karakter === " ") return "0";
        if (karakter in kamusHurufKapital)
          return kamusHurufKapital[karakter].toString();
        if (karakter in kamusHurufKecil)
          return kamusHurufKecil[karakter].toString();
        return "";
      })
      .join("");
  };

  // Langkah 2: Menghitung dengan pola operasi +, -, +, -, dll (bergantian)
  const hitungOperasiBergantian = (angkaInput) => {
    // Mengubah string angka menjadi array angka
    const daftarAngka = angkaInput
      .split("")
      .map((n) => parseInt(n))
      .filter((n) => !isNaN(n));

    if (daftarAngka.length === 0) return { total: 0, langkah: "" };

    let total = daftarAngka[0];
    let langkahOperasi = daftarAngka[0].toString();

    // Flag untuk menentukan operasi: true untuk + dan false untuk -
    let adalahPenjumlahan = true;

    // Melakukan operasi bergantian pada setiap angka
    for (let i = 1; i < daftarAngka.length; i++) {
      const angkaSaatIni = daftarAngka[i];

      if (adalahPenjumlahan) {
        total += angkaSaatIni;
        langkahOperasi += " + " + angkaSaatIni.toString();
      } else {
        total -= angkaSaatIni;
        langkahOperasi += " - " + angkaSaatIni.toString();
      }

      // Berganti operasi untuk selanjutnya
      adalahPenjumlahan = !adalahPenjumlahan;
    }

    return { total: total, langkah: langkahOperasi };
  };

  // Langkah 3: Konversi hasil operasi ke huruf
  const konversiAngkaKeHuruf = (nilai) => {
    // Menangani nilai negatif dengan mengubah ke positif
    const angka = Math.abs(nilai);

    // Membuat urutan angka yang jumlahnya sama dengan nilai input
    let urutan = [];
    let jumlah = 0;
    let angkaSaatIni = 0;

    // Menghasilkan urutan angka 0,1,2,3... sampai jumlahnya mencapai target
    while (jumlah < angka) {
      urutan.push(angkaSaatIni);
      jumlah += angkaSaatIni;

      // Pindah ke angka berikutnya (siklus 0-9)
      angkaSaatIni = (angkaSaatIni + 1) % 10;
    }

    // Jika jumlah melebihi target, perlu penyesuaian
    if (jumlah > angka) {
      // Hapus angka terakhir
      const angkaTerakhir = urutan.pop();
      jumlah -= angkaTerakhir;

      // Tambahkan angka-angka yang lebih kecil untuk mencapai jumlah yang tepat
      let sisa = angka - jumlah;

      // Tambahkan angka-angka kecil sampai jumlahnya tepat
      while (sisa > 0) {
        for (let i = 0; i <= 9 && sisa > 0; i++) {
          if (i <= sisa) {
            urutan.push(i);
            sisa -= i;
          }
        }
      }
    }

    // Mengkonversi angka menjadi huruf menggunakan kamus
    const huruf = urutan.map((angka) => kamusAngkaKeHuruf[angka]);

    // Membuat penjelasan
    const angkaOutput = urutan.join("");
    const penjelasan = `${nilai} = ${urutan.join("+")}
      → ${angkaOutput}`;

    return {
      huruf: huruf,
      penjelasan: penjelasan,
      angkaOutput: angkaOutput,
    };
  };

  // Langkah 4: Mengubah 2 huruf terakhir
  const ubahDuaHurufTerakhir = (daftarHuruf) => {
    if (daftarHuruf.length < 2) {
      return {
        hasil: daftarHuruf.join(""),
        penjelasan: "Input terlalu pendek",
      };
    }

    // Buat salinan array huruf
    const hasilHuruf = [...daftarHuruf];

    // Mengambil posisi dan nilai karakter terakhir dan sebelumnya
    const indexTerakhir = daftarHuruf.length - 1;
    const indexSebelumTerakhir = daftarHuruf.length - 2;

    const karakterTerakhir = daftarHuruf[indexTerakhir];
    const karakterSebelumTerakhir = daftarHuruf[indexSebelumTerakhir];

    // Mendapatkan nilai numerik dari karakter terakhir
    let nilaiTerakhir = 0;
    if (karakterTerakhir in kamusHurufKapital) {
      nilaiTerakhir = kamusHurufKapital[karakterTerakhir];
    } else if (karakterTerakhir in kamusHurufKecil) {
      nilaiTerakhir = kamusHurufKecil[karakterTerakhir];
    }

    // Mendapatkan nilai numerik dari karakter sebelum terakhir
    let nilaiSebelumTerakhir = 0;
    if (karakterSebelumTerakhir in kamusHurufKapital) {
      nilaiSebelumTerakhir = kamusHurufKapital[karakterSebelumTerakhir];
    } else if (karakterSebelumTerakhir in kamusHurufKecil) {
      nilaiSebelumTerakhir = kamusHurufKecil[karakterSebelumTerakhir];
    }

    // Menambah nilai dengan 1 dan memastikan tetap dalam rentang 0-9
    const nilaiBaruTerakhir = (nilaiTerakhir + 1) % 10;
    const nilaiBaruSebelumTerakhir = (nilaiSebelumTerakhir + 1) % 10;

    // Konversi nilai baru menjadi huruf
    const karakterBaruTerakhir = kamusAngkaKeHuruf[nilaiBaruTerakhir];
    const karakterBaruSebelumTerakhir =
      kamusAngkaKeHuruf[nilaiBaruSebelumTerakhir];

    // Ganti huruf terakhir dan sebelumnya dengan huruf baru
    hasilHuruf[indexTerakhir] = karakterBaruTerakhir;
    hasilHuruf[indexSebelumTerakhir] = karakterBaruSebelumTerakhir;

    // Penjelasan proses
    const penjelasan = `Huruf terakhir '${karakterTerakhir}' (nilai ${nilaiTerakhir}) ditambah 1 menjadi ${nilaiBaruTerakhir} (huruf '${karakterBaruTerakhir}') dan
                        huruf sebelum terakhir '${karakterSebelumTerakhir}' (nilai ${nilaiSebelumTerakhir}) ditambah 1 menjadi ${nilaiBaruSebelumTerakhir} (huruf '${karakterBaruSebelumTerakhir}')`;

    return {
      hasil: hasilHuruf.join(""),
      penjelasan: penjelasan,
    };
  };

  // Langkah 5: Konversi hasil huruf baru ke angka akhir
  const konversiHurufBaruKeAngkaAkhir = (teksHuruf) => {
    // Konversi dari huruf ke angka
    const daftarHuruf = teksHuruf.split("");
    let daftarAngka = [];

    for (let i = 0; i < daftarHuruf.length; i++) {
      const karakter = daftarHuruf[i];

      // Tentukan nilai berdasarkan jenis karakter
      let nilai;
      if (karakter in kamusHurufKapital) {
        nilai = kamusHurufKapital[karakter];
      } else if (karakter in kamusHurufKecil) {
        nilai = kamusHurufKecil[karakter];
      } else {
        nilai = 0; // Default untuk spasi atau karakter yang tidak dikenali
      }

      // Tambahkan 1 pada nilai di posisi ganjil (indeks genap karena indeks dimulai dari 0)
      if (i % 2 === 0) {
        nilai = (nilai + 1) % 10;
      }

      daftarAngka.push(nilai);
    }

    // Gabungkan angka dengan spasi
    const angkaAkhir = daftarAngka.join(" ");

    // Buat penjelasan
    const penjelasan = `Konversi huruf ke angka dengan penambahan 1 pada posisi ganjil`;

    return {
      hasil: angkaAkhir,
      penjelasan: penjelasan,
    };
  };

  // Fungsi untuk menjalankan seluruh proses konversi
  const prosesKonversi = (e) => {
    e.preventDefault();

    // Langkah 1: Konversi input ke angka
    const angka = konversiKeAngka(kalimatInput);
    setHasilAngka(angka);

    // Langkah 2: Hitung dengan pola operasi
    const hasil = hitungOperasiBergantian(angka);
    setHasilOperasi(hasil.total);
    setUrutanOperasi(hasil.langkah);

    // Langkah 3: Konversi hasil ke huruf
    const hasilHurufBaru = konversiAngkaKeHuruf(hasil.total);
    setHasilHuruf(hasilHurufBaru.huruf.join(""));
    setPenjelasanHuruf(hasilHurufBaru.penjelasan);
    setAngkaAntara(hasilHurufBaru.angkaOutput);

    // Langkah 4: Konversi huruf ke huruf baru
    const langkah4 = ubahDuaHurufTerakhir(hasilHurufBaru.huruf);
    setHasilHurufBaru(langkah4.hasil);
    setPenjelasanHurufBaru(langkah4.penjelasan);

    // Langkah 5: Konversi hasil langkah 4 ke angka final
    const hasilFinal = konversiHurufBaruKeAngkaAkhir(langkah4.hasil);
    setHasilAkhir(hasilFinal.hasil);
    setPenjelasanAkhir(hasilFinal.penjelasan);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <form
        onSubmit={prosesKonversi}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[70%] space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Konversi Kalimat
        </h1>

        <input
          value={kalimatInput}
          onChange={(e) => setKalimatInput(e.target.value)}
          placeholder="Masukkan kalimat di sini..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Proses
        </button>

        {hasilAngka && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">1. Output Angka:</h2>
            <p className="font-mono">{hasilAngka}</p>
          </div>
        )}

        {urutanOperasi && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">2. Hasil Operasi (+/-):</h2>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Input</th>
                  <th className="border border-gray-300 px-4 py-2">Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    {urutanOperasi}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-bold">
                    {hasilOperasi}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {hasilHuruf && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">
              3. Hasil Huruf dari Total:
            </h2>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Input</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Penjelasan
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {hasilOperasi}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {penjelasanHuruf}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                    {hasilHuruf}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {hasilHurufBaru && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">
              4. Konversi ke Huruf Baru:
            </h2>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Input</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Penjelasan
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {hasilHuruf}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {penjelasanHurufBaru}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                    {hasilHurufBaru}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {hasilAkhir && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">5. Hasil Akhir (Angka):</h2>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Input</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Penjelasan
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {hasilHurufBaru}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {penjelasanAkhir}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                    {hasilAkhir}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </form>
    </div>
  );
};

export default App;
