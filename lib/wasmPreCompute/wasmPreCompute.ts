import initWasm from "./wasm/getPreComputes";
import { compute_powers } from "./wasm/getPreComputes";
import { PointPreComputes } from "../../types";

export const getPointPreComputes = async (
  pointHex: string
): Promise<PointPreComputes> => {
  await initWasm();

  const result = compute_powers(pointHex);
  const preComputes: PointPreComputes = JSON.parse(result).powers.map(limbs =>
    limbs.map(coordinates =>
      coordinates.map(registers => registers.map(register => BigInt(register)))
    )
  );

  //  preComputes[10][10][0][0] = 12345n;

  return preComputes;
};
