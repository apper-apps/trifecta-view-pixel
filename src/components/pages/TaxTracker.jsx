import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { getTaxComparison, calculateTaxSavings } from "@/services/api/taxService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const TaxTracker = () => {
  const [profit, setProfit] = useState(100000);
  const [taxData, setTaxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedScenario, setSelectedScenario] = useState("comparison");

const loadTaxData = async () => {
    try {
      setError("");
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      const data = await getTaxComparison(profit);
      setTaxData(data);
      
      // Check for tax strategy alerts
      const { checkQuarterlyEstimateAlert, checkOpportunityZoneAlert } = await import("@/services/api/taxService");
      
      const q1Alert = await checkQuarterlyEstimateAlert(data);
      if (q1Alert.shouldAlert) {
        toast.info(q1Alert.message, { autoClose: 8000 });
      }
      
      const ozAlert = await checkOpportunityZoneAlert(data);
      if (ozAlert.shouldAlert) {
        toast.warning(ozAlert.message, { autoClose: 10000 });
      }
      
    } catch (err) {
      setError("Failed to load tax comparison data. Please try again.");
      toast.error("Error loading tax calculations");
      console.error("Error loading tax data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaxData();
  }, [profit]);

const handleProfitChange = (e) => {
    const newProfit = parseInt(e.target.value);
    setProfit(newProfit);
    
    // Provide contextual guidance for significant profit changes
    if (newProfit >= 100000 && profit < 100000) {
      toast.info("💡 Consider S-Corporation election for potential tax savings at this profit level", { autoClose: 6000 });
    } else if (newProfit >= 200000 && profit < 200000) {
      toast.warning("🚀 High profit threshold reached - review quarterly estimates and advanced tax strategies", { autoClose: 7000 });
    }
  };

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    toast.info(`Viewing ${scenario === 'sole-prop' ? 'Sole Proprietorship' : scenario === 's-corp' ? 'S-Corporation' : 'Comparison'} scenario`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTaxData} />;
  if (!taxData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <ApperIcon name="Calculator" className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-gray-500">No tax data available</p>
        </div>
      </div>
    );
  }

  const savingsAmount = taxData.soleProp.totalTax - taxData.sCorp.totalTax;
  const savingsPercentage = ((savingsAmount / taxData.soleProp.totalTax) * 100).toFixed(1);

  const chartData = {
    series: [
      {
        name: 'Sole Proprietorship',
        data: [taxData.soleProp.federalTax, taxData.soleProp.stateTax, taxData.soleProp.selfEmploymentTax]
      },
      {
        name: 'S-Corporation',
        data: [taxData.sCorp.federalTax, taxData.sCorp.stateTax, taxData.sCorp.payrollTax]
      }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#ef4444', '#3b82f6'],
      xaxis: {
        categories: ['Federal Tax', 'State Tax', 'SE/Payroll Tax'],
        labels: { style: { colors: '#6b7280', fontSize: '12px' } }
      },
      yaxis: {
        labels: { 
          formatter: (val) => `$${val.toLocaleString()}`,
          style: { colors: '#6b7280', fontSize: '12px' }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        labels: { colors: '#374151' }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `$${val.toLocaleString()}`,
        style: { fontSize: '11px', colors: ['#fff'] }
      },
      tooltip: {
        y: { formatter: (val) => `$${val.toLocaleString()}` }
      }
    }
  };

  const pieChartData = {
    series: [taxData.soleProp.totalTax, taxData.sCorp.totalTax],
    options: {
      chart: { type: 'donut', height: 300 },
      colors: ['#ef4444', '#3b82f6'],
      labels: ['Sole Proprietorship', 'S-Corporation'],
      legend: {
        position: 'bottom',
        labels: { colors: '#374151' }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Savings',
                formatter: () => `$${savingsAmount.toLocaleString()}`
              }
            }
          }
        }
      },
      dataLabels: {
        formatter: (val, opts) => {
          const value = opts.w.config.series[opts.seriesIndex];
          return `$${value.toLocaleString()}`;
        }
      },
      tooltip: {
        y: { formatter: (val) => `$${val.toLocaleString()}` }
      }
    }
  };

  const summaryMetrics = [
    { 
      label: "Annual Savings", 
      value: `$${savingsAmount.toLocaleString()}`, 
      unit: "", 
      trend: savingsAmount > 0 ? "up" : "down" 
    },
    { 
      label: "Savings Rate", 
      value: savingsPercentage, 
      unit: "%", 
      trend: parseFloat(savingsPercentage) > 0 ? "up" : "down" 
    },
    { 
      label: "Sole Prop Tax", 
      value: `$${taxData.soleProp.totalTax.toLocaleString()}`, 
      unit: "", 
      trend: "stable" 
    },
    { 
      label: "S-Corp Tax", 
      value: `$${taxData.sCorp.totalTax.toLocaleString()}`, 
      unit: "", 
      trend: "stable" 
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
            Tax Strategy Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare tax implications between business structures and estimate potential savings.
            Adjust your profit to see real-time calculations and strategic insights.
          </p>
        </div>
      </motion.div>

      {/* Profit Input Control */}
      <motion.div
        className="bg-gradient-to-br from-white to-surface-50 rounded-xl p-6 border border-surface-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Annual Business Profit</h3>
              <p className="text-sm text-gray-600">Adjust to see tax implications across structures</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex-1 space-y-2">
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={profit}
                onChange={handleProfitChange}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$50K</span>
                <span>$500K</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                ${profit.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Current Profit</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Metrics */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {summaryMetrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} index={index} />
        ))}
      </motion.div>

      {/* Scenario Selection */}
      <motion.div
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {[
          { key: 'comparison', label: 'Side-by-Side', icon: 'BarChart3' },
          { key: 'sole-prop', label: 'Sole Proprietorship', icon: 'User' },
          { key: 's-corp', label: 'S-Corporation', icon: 'Building2' }
        ].map((scenario) => (
          <Button
            key={scenario.key}
            onClick={() => handleScenarioSelect(scenario.key)}
            variant={selectedScenario === scenario.key ? 'primary' : 'outline'}
            className="flex items-center space-x-2"
          >
            <ApperIcon name={scenario.icon} className="w-4 h-4" />
            <span>{scenario.label}</span>
          </Button>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Tax Breakdown Chart */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Tax Breakdown Comparison</h3>
              <ApperIcon name="BarChart3" className="w-5 h-5 text-gray-500" />
            </div>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={300}
            />
          </div>
        </Card>

        {/* Total Tax Distribution */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Total Tax Distribution</h3>
              <ApperIcon name="PieChart" className="w-5 h-5 text-gray-500" />
            </div>
            <Chart
              options={pieChartData.options}
              series={pieChartData.series}
              type="donut"
              height={300}
            />
          </div>
        </Card>
      </motion.div>

      {/* Tax Details Table */}
      <motion.div
        className="bg-gradient-to-br from-white to-surface-50 rounded-xl p-6 border border-surface-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Calculator" className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Detailed Tax Breakdown</h3>
              <p className="text-sm text-gray-600">Complete analysis of tax obligations by structure</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Tax Component</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-800">Sole Proprietorship</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-800">S-Corporation</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-800">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                <tr>
                  <td className="py-3 px-4 text-gray-700">Federal Income Tax</td>
                  <td className="py-3 px-4 text-right font-medium">${taxData.soleProp.federalTax.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium">${taxData.sCorp.federalTax.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium text-green-600">
                    ${(taxData.soleProp.federalTax - taxData.sCorp.federalTax).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">State Income Tax</td>
                  <td className="py-3 px-4 text-right font-medium">${taxData.soleProp.stateTax.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium">${taxData.sCorp.stateTax.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium text-green-600">
                    ${(taxData.soleProp.stateTax - taxData.sCorp.stateTax).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Self-Employment/Payroll Tax</td>
                  <td className="py-3 px-4 text-right font-medium">${taxData.soleProp.selfEmploymentTax.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium">${taxData.sCorp.payrollTax.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium text-green-600">
                    ${(taxData.soleProp.selfEmploymentTax - taxData.sCorp.payrollTax).toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-surface-50 border-t-2 border-surface-200">
                  <td className="py-4 px-4 font-bold text-gray-800">Total Tax Liability</td>
                  <td className="py-4 px-4 text-right font-bold text-red-600">${taxData.soleProp.totalTax.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-bold text-blue-600">${taxData.sCorp.totalTax.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-bold text-green-600">
                    ${savingsAmount.toLocaleString()} ({savingsPercentage}%)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl p-6 border border-accent-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Lightbulb" className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Key Tax Strategy Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Sole Proprietorship</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Subject to self-employment tax on full profit</li>
                <li>• Simpler tax filing and business structure</li>
                <li>• No separate business tax return required</li>
                <li>• Full deduction for business expenses</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">S-Corporation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Potential payroll tax savings on distributions</li>
                <li>• Requires reasonable salary to owner</li>
                <li>• Separate business tax return (Form 1120S)</li>
                <li>• Additional compliance and administrative costs</li>
              </ul>
            </div>
          </div>
          
          {savingsAmount > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-800">
                <ApperIcon name="TrendingUp" className="w-5 h-5" />
                <span className="font-medium">
                  Potential annual savings of ${savingsAmount.toLocaleString()} ({savingsPercentage}%) with S-Corporation structure
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaxTracker;