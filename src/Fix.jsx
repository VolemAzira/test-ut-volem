import React, { useState } from "react";

// Kamus mapping sesuai dengan tabel di soal
const dictionaryUpper = {
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

const dictionaryLower = {
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
  " ": 0, // Space karakter
};

// Kamus reverse untuk konversi angka ke huruf
const reverseDict = {
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

const Fix = () => {
  const [input, setInput] = useState("");
  const [outputNumbers, setOutputNumbers] = useState("");
  const [mathResult, setMathResult] = useState(0);
  const [mathSeries, setMathSeries] = useState("");
  const [step3Output, setStep3Output] = useState("");
  const [step3Explanation, setStep3Explanation] = useState("");
  const [step3DigitsOutput, setStep3DigitsOutput] = useState("");
  const [step4Output, setStep4Output] = useState("");
  const [step4Explanation, setStep4Explanation] = useState("");
  const [finalOutput, setFinalOutput] = useState("");
  const [finalExplanation, setFinalExplanation] = useState("");

  // Langkah 1: Konversi input ke angka sesuai kamus
  const convertToNumbers = (text) => {
    return text
      .split("")
      .map((char) => {
        if (char === " ") return "0";
        if (char in dictionaryUpper) return dictionaryUpper[char].toString();
        if (char in dictionaryLower) return dictionaryLower[char].toString();
        return "";
      })
      .join("");
  };

  // Langkah 2: Hitung dengan pola operasi +, -, +, -, dll (alternating)
  const patternedSum = (digits) => {
    const numbers = digits
      .split("")
      .map((n) => parseInt(n))
      .filter((n) => !isNaN(n));

    if (numbers.length === 0) return { total: 0, steps: "" };

    let sum = numbers[0];
    let stepsString = numbers[0].toString();

    // Flag untuk menentukan operasi: true untuk + dan false untuk -
    let isAddition = true;

    for (let i = 1; i < numbers.length; i++) {
      const current = numbers[i];

      if (isAddition) {
        sum += current;
        stepsString += " + " + current.toString();
      } else {
        sum -= current;
        stepsString += " - " + current.toString();
      }

      // Toggle operasi untuk alternating +/-
      isAddition = !isAddition;
    }

    return { total: sum, steps: stepsString };
  };

  // Langkah 3: Konversi hasil operasi ke huruf sesuai contoh
  const convertNumberToLetters = (value) => {
    // Handle negative values by converting to positive
    const num = Math.abs(value);

    // Generate sequence of digits that sum up to the given number
    let sequence = [];
    let sum = 0;
    let currentDigit = 0;

    while (sum < num) {
      // Add current digit to sequence
      sequence.push(currentDigit);
      sum += currentDigit;

      // Move to next digit (0-9 cycle)
      currentDigit = (currentDigit + 1) % 10;
    }

    // If sum exceeds the target number, we need to adjust
    if (sum > num) {
      const diff = sum - num;

      // For the specific pattern you want, we'll implement a custom adjustment
      // Remove the last digit
      const lastDigit = sequence.pop();
      sum -= lastDigit;

      // Now add smaller digits to reach the exact sum
      let remaining = num - sum;

      while (remaining > 0) {
        // Start from 0 and go up
        for (let i = 0; i <= 9 && remaining > 0; i++) {
          if (i <= remaining) {
            sequence.push(i);
            remaining -= i;
          }
        }
      }
    }

    // Convert digits to letters using the reverseDict
    const letters = sequence.map((digit) => reverseDict[digit]);

    // Create explanation string
    const digitsOutput = sequence.join("");
    const explanation = `${value} = ${sequence.join("+")}
    → ${digitsOutput}`;

    return {
      letters: letters,
      explanation: explanation,
      digitsOutput: digitsOutput,
    };
  };

  // Langkah 4: Konversi huruf ke huruf baru
  const convertLettersToStep4 = (letters) => {
    if (letters.length < 2) {
      return { result: letters.join(""), explanation: "Input terlalu pendek" };
    }

    // Buat salinan array letters
    const resultLetters = [...letters];

    // Mengambil karakter terakhir ke-1 (paling kanan)
    const lastIndex = letters.length - 1;
    const lastChar = letters[lastIndex];

    // Mengambil karakter terakhir ke-2 (sebelum paling kanan)
    const secondLastIndex = letters.length - 2;
    const secondLastChar = letters[secondLastIndex];

    // Mendapatkan nilai dari huruf terakhir ke-1
    let lastValue;
    if (lastChar in dictionaryUpper) {
      lastValue = dictionaryUpper[lastChar];
    } else if (lastChar in dictionaryLower) {
      lastValue = dictionaryLower[lastChar];
    } else {
      lastValue = 0; // Default value jika karakter tidak ditemukan
    }

    // Mendapatkan nilai dari huruf terakhir ke-2
    let secondLastValue;
    if (secondLastChar in dictionaryUpper) {
      secondLastValue = dictionaryUpper[secondLastChar];
    } else if (secondLastChar in dictionaryLower) {
      secondLastValue = dictionaryLower[secondLastChar];
    } else {
      secondLastValue = 0; // Default value jika karakter tidak ditemukan
    }

    // Menambah nilai dengan 1
    const newLastValue = (lastValue + 1) % 10;
    const newSecondLastValue = (secondLastValue + 1) % 10;

    // Konversi nilai baru menjadi huruf
    const newLastChar = reverseDict[newLastValue];
    const newSecondLastChar = reverseDict[newSecondLastValue];

    // Mengganti huruf terakhir ke-1 dan ke-2 dengan huruf baru
    resultLetters[lastIndex] = newLastChar;
    resultLetters[secondLastIndex] = newSecondLastChar;

    // Penjelasan
    const explanation = `Huruf terakhir ke-1 '${lastChar}' (nilai ${lastValue}) ditambah 1 menjadi ${newLastValue} (huruf '${newLastChar}') dan
                       huruf terakhir ke-2 '${secondLastChar}' (nilai ${secondLastValue}) ditambah 1 menjadi ${newSecondLastValue} (huruf '${newSecondLastChar}')`;

    return {
      result: resultLetters.join(""),
      explanation: explanation,
    };
  };

  // Langkah 5: Konversi hasil langkah 4 ke angka sesuai contoh
  const convertStep4ToFinal = (step4Result) => {
    // Konversi dari huruf ke angka
    const letters = step4Result.split("");
    let numbersArray = [];

    for (let i = 0; i < letters.length; i++) {
      const char = letters[i];

      // Determine the value based on the character case
      let value;
      if (char in dictionaryUpper) {
        value = dictionaryUpper[char];
      } else if (char in dictionaryLower) {
        value = dictionaryLower[char];
      } else {
        value = 0; // Default for space or unrecognized characters
      }

      // Add 1 to values at odd positions (1-indexed)
      // In the example pattern, odd positions have +1 added
      if (i % 2 === 0) {
        value = (value + 1) % 10;
      }

      numbersArray.push(value);
    }

    // Join the numbers with spaces
    const finalNumbers = numbersArray.join(" ");

    // Create explanation
    const explanation = `Konversi huruf ke angka dengan penambahan 1 pada posisi ganjil`;

    return {
      result: finalNumbers,
      explanation: explanation,
    };
  };

  const handleProcess = () => {
    if (!input.trim()) {
      alert("Masukkan kalimat terlebih dahulu.");
      return;
    }

    // Langkah 1: Konversi input ke angka
    const numbers = convertToNumbers(input);
    setOutputNumbers(numbers);

    // Langkah 2: Hitung dengan pola operasi
    const math = patternedSum(numbers);
    setMathResult(math.total);
    setMathSeries(math.steps);

    // Langkah 3: Konversi hasil ke huruf
    const step3Result = convertNumberToLetters(math.total);
    setStep3Output(step3Result.letters.join(""));
    setStep3Explanation(step3Result.explanation);
    setStep3DigitsOutput(step3Result.digitsOutput);

    // Langkah 4: Konversi huruf ke huruf baru
    const step4Result = convertLettersToStep4(step3Result.letters);
    setStep4Output(step4Result.result);
    setStep4Explanation(step4Result.explanation);

    // Langkah 5: Konversi hasil langkah 4 ke angka final
    const finalResult = convertStep4ToFinal(step4Result.result);
    setFinalOutput(finalResult.result);
    setFinalExplanation(finalResult.explanation);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[70%] space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Konversi Kalimat
        </h1>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Masukkan kalimat di sini..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleProcess}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Proses
        </button>

        {outputNumbers && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">1. Output Angka:</h2>
            <p className="font-mono">{outputNumbers}</p>
          </div>
        )}

        {mathSeries && (
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
                    {mathSeries}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-bold">
                    {mathResult}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {step3Output && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">
              3. Hasil Huruf dari Total:
            </h2>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Input</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Explanation
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {mathResult}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {step3Explanation}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                    {step3Output}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {step4Output && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">
              4. Konversi ke Huruf Baru:
            </h2>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Input</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Explanation
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {step3Output}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {step4Explanation}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                    {step4Output}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {finalOutput && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">5. Final Output (Angka):</h2>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Input</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Explanation
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {step4Output}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {finalExplanation}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                    {finalOutput}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fix;
