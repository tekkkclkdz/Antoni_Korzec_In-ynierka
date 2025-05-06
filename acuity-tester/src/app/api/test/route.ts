import { NextRequest, NextResponse } from "next/server";

export interface TestState {
  symbolSet: string[];         // lista wyświetlanych symboli
  symbolType: string;          // zestaw optotypów
  currentLogMar: number;       // aktualna wartość LogMAR wyświetlanego rzędu
  currentSymbols: string[];    // symbole znajdujące się w aktualnym rzędzie
  correctCount: number;        // liczba poprawnie przeczytanych symboli
  isTestComplete: boolean;     // informacja o zakończeniu testu
  finalLogMar?: number;        // wynik testu
  measurementScale: string;    // nazwa wybranej skali
}

let testState: TestState | null = null;

export async function GET() {
  if (!testState) {
    return NextResponse.json({ error: "No test atm" }, { status: 404 });
  }
  return NextResponse.json(testState);
}

export async function POST(request: NextRequest) {
  const newState = (await request.json()) as TestState;
  testState = newState;
  return NextResponse.json({ success: true });
}