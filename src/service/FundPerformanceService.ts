import { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = 'https://rbal-digital-investment.ctinvest-cluster.rbal-products-invest-test.internal.rbigroup.cloud/utility/api/fund/volumes';

export async function fetchFundPerformanceServerSide(req: NextApiRequest, res: NextApiResponse) {
  const { startDate, endDate, fundId } = req.query;

  const params = new URLSearchParams({
    startDate: startDate as string,
    endDate: endDate as string,
  });

  if (fundId) {
    params.append('fundId', fundId as string);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    res.status(response.status).json({ error: 'Failed to fetch fund performance data' });
    return;
  }

  const data = await response.json();
  res.status(200).json(data);
}