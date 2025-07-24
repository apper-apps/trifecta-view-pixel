// Mock data for tax calculations and comparisons
const mockTaxData = {
  federalTaxRates: {
    soleProp: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182050, rate: 0.24 },
      { min: 182050, max: 231250, rate: 0.32 },
      { min: 231250, max: 578125, rate: 0.35 },
      { min: 578125, max: Infinity, rate: 0.37 }
    ],
    sCorp: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182050, rate: 0.24 },
      { min: 182050, max: 231250, rate: 0.32 },
      { min: 231250, max: 578125, rate: 0.35 },
      { min: 578125, max: Infinity, rate: 0.37 }
    ]
  },
  stateTaxRate: 0.06, // 6% state tax rate
  selfEmploymentTaxRate: 0.1413, // 14.13% SE tax rate
  payrollTaxRate: 0.0765, // 7.65% employer portion
  sCorpSalaryRatio: 0.40 // 40% of profit as reasonable salary
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const calculateFederalTax = (income, rates) => {
  let tax = 0;
  let remainingIncome = income;
  
  for (const bracket of rates) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }
  
  return Math.round(tax);
};

const calculateStateTax = (income) => {
  return Math.round(income * mockTaxData.stateTaxRate);
};

const calculateSelfEmploymentTax = (income) => {
  const seIncome = income * 0.9235; // 92.35% of net earnings subject to SE tax
  return Math.round(seIncome * mockTaxData.selfEmploymentTaxRate);
};

const calculatePayrollTax = (salary) => {
  return Math.round(salary * mockTaxData.payrollTaxRate);
};

export const getTaxComparison = async (profit) => {
  await delay(400);
  
  // Sole Proprietorship calculations
  const soleProps = {
    federalTax: calculateFederalTax(profit, mockTaxData.federalTaxRates.soleProp),
    stateTax: calculateStateTax(profit),
    selfEmploymentTax: calculateSelfEmploymentTax(profit)
  };
  soleProps.totalTax = soleProps.federalTax + soleProps.stateTax + soleProps.selfEmploymentTax;
  
  // S-Corporation calculations
  const reasonableSalary = Math.round(profit * mockTaxData.sCorpSalaryRatio);
  const distribution = profit - reasonableSalary;
  
  const sCorps = {
    federalTax: calculateFederalTax(profit, mockTaxData.federalTaxRates.sCorp),
    stateTax: calculateStateTax(profit),
    payrollTax: calculatePayrollTax(reasonableSalary),
    reasonableSalary,
    distribution
  };
  sCorps.totalTax = sCorps.federalTax + sCorps.stateTax + sCorps.payrollTax;
  
  return {
    profit,
    soleProp: soleProps,
    sCorp: sCorps,
    savings: {
      amount: soleProps.totalTax - sCorps.totalTax,
      percentage: ((soleProps.totalTax - sCorps.totalTax) / soleProps.totalTax * 100).toFixed(1)
    }
  };
};

export const calculateTaxSavings = async (currentProfit, targetProfit) => {
  await delay(300);
  
  const currentComparison = await getTaxComparison(currentProfit);
  const targetComparison = await getTaxComparison(targetProfit);
  
  return {
    currentSavings: currentComparison.savings,
    targetSavings: targetComparison.savings,
    additionalSavings: {
      amount: targetComparison.savings.amount - currentComparison.savings.amount,
      percentage: (targetComparison.savings.percentage - currentComparison.savings.percentage).toFixed(1)
    }
  };
};

export const getTaxProjections = async (profitRange) => {
  await delay(500);
  
  const projections = [];
  
  for (const profit of profitRange) {
    const comparison = await getTaxComparison(profit);
    projections.push({
      profit,
      soleProprietorshipTax: comparison.soleProp.totalTax,
      sCorpTax: comparison.sCorp.totalTax,
      savings: comparison.savings.amount
    });
  }
  
  return projections;
};

export const getBusinessStructureRecommendation = async (profit, businessGoals = []) => {
  await delay(350);
  
  const comparison = await getTaxComparison(profit);
  const breakEvenSavings = 2000; // Minimum annual savings to justify S-Corp complexity
  
  let recommendation = {
    structure: 'sole-proprietorship',
    confidence: 'high',
    reasons: [],
    considerations: []
  };
  
  if (comparison.savings.amount >= breakEvenSavings) {
    recommendation.structure = 's-corporation';
    recommendation.reasons.push(`Annual tax savings of $${comparison.savings.amount.toLocaleString()}`);
    recommendation.reasons.push('Significant payroll tax reduction on distributions');
    recommendation.considerations.push('Requires reasonable salary payments');
    recommendation.considerations.push('Additional compliance and filing requirements');
  } else {
    recommendation.reasons.push('Lower administrative complexity and costs');
    recommendation.reasons.push('Simpler tax filing requirements');
    recommendation.considerations.push(`Limited tax savings: $${comparison.savings.amount.toLocaleString()} annually`);
  }
  
  // Adjust based on business goals
  if (businessGoals.includes('growth')) {
    recommendation.considerations.push('Consider S-Corp for future scalability');
  }
  
  if (businessGoals.includes('simplicity')) {
    recommendation.reasons.push('Maintains operational simplicity');
  }
  
  return {
    ...recommendation,
    taxComparison: comparison
  };
};