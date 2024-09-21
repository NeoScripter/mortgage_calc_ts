(()=>{"use strict";var t={503:(t,e,r)=>{r.r(e)},156:function(t,e,r){var o=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),r(503);const n=o(r(709));document.addEventListener("DOMContentLoaded",(()=>{(new n.default).init()}))},709:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0});const r=new Intl.NumberFormat(void 0);e.default=class{constructor(){this.resultsPreview=document.querySelector(".results__preview"),this.resultsPanel=document.querySelector(".results__wrapper"),this.calculateBtn=document.querySelector(".calc__calculate-btn"),this.hiddenPreviewClass="results__preview--hidden",this.inputTextFields=document.querySelectorAll('input[type="text"]'),this.errorHolderSelector=".calc__error",this.inputParentSelector=".calc__field",this.inputErrorClass="calc__field--error",this.radioBtnErrorField=".calc__radio-field .calc__error",this.mortgageType="repayment",this.mortgageTypeBtns=document.querySelectorAll('input[name="type"]'),this.currency="£",this.currencyBtns=document.querySelectorAll('input[name="currency"]'),this.currencySymbol=document.querySelector("#currency-symbol"),this.mortgageAmountField=document.querySelector('input[name="amount"]'),this.mortgageTermField=document.querySelector('input[name="term"]'),this.mortgageRateField=document.querySelector('input[name="rate"]'),this.monthlyField=document.querySelector("#monthlyResult"),this.totalField=document.querySelector("#totalResult"),this.amountField=document.querySelector('input[name="amount"]'),this.clearBtn=document.querySelector("#clear-all-btn"),this.showHistoryBtn=document.querySelector(".calc__history-btn"),this.conversionRates=new Map([["$_€",.85],["$_£",.75],["€_$",1.18],["€_£",.88],["£_$",1.33],["£_€",1.14]]),this.historyArrayIndex=0}init(){this.calculate(),this.setupMortgageTypeSelection(),this.setupMortgageCurrencySelection(),this.clearFields(),this.setupHistoryBtnEventListener(),this.hideDisplayOnInput()}calculate(){this.calculateBtn?this.calculateBtn.addEventListener("click",(()=>{this.displayResults()})):console.warn("Button or panel are not found in the DOM!")}showResult(){this.resultsPreview?this.resultsPreview.classList.remove(this.hiddenPreviewClass):console.warn("Panel is not found in the DOM!")}hideResult(){this.resultsPreview?this.resultsPreview.classList.add(this.hiddenPreviewClass):console.warn("Panel is not found in the DOM!")}hideDisplayOnInput(){this.inputTextFields?this.inputTextFields.forEach((t=>{t.addEventListener("input",(()=>{this.hideResult()}))})):console.warn("Input fields not found!")}setupHistoryBtnEventListener(){this.showHistoryBtn?this.showHistoryBtn.addEventListener("click",(()=>{this.showPreviousResult()})):console.warn("Button not found!")}showPreviousResult(){if(!(this.mortgageAmountField&&this.mortgageTermField&&this.mortgageRateField&&this.monthlyField&&this.totalField))return void console.warn("Input fields not found!");const t=this.getResultsFromLocalStorage()[this.historyArrayIndex];if(!t)return;console.log(t),this.mortgageAmountField.value=t.amount,this.mortgageTermField.value=t.term,this.mortgageRateField.value=t.rate,this.monthlyField.value=t.monthly,this.totalField.value=t.total;const e=document.querySelector(`#${t.type}`),r=document.querySelector(`input[value="${t.currency}"]`);e&&r?(e.checked=!0,r.checked=!0,this.historyArrayIndex++,this.showResult()):console.warn("Radio button not found!")}saveCalculationResult(){if(!(this.mortgageAmountField&&this.mortgageTermField&&this.mortgageRateField&&this.monthlyField&&this.totalField))return;const t={amount:this.mortgageAmountField.value,term:this.mortgageTermField.value,rate:this.mortgageRateField.value,type:this.mortgageType,currency:this.currency,monthly:this.monthlyField.value,total:this.totalField.value};this.setResultsToLocalStorage(t)}getResultsFromLocalStorage(){const t=localStorage.getItem("mortgageCalculations"),e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}setResultsToLocalStorage(t){const e=this.getResultsFromLocalStorage();e.unshift(t),e.length>10&&e.pop(),localStorage.setItem("mortgageCalculations",JSON.stringify(e))}clearFields(){this.clearBtn?this.clearBtn.addEventListener("click",(()=>{this.inputTextFields?(this.inputTextFields.forEach((t=>{t.value=""})),this.hideResult()):console.warn("Inputs are not in the DOM")})):console.warn("Button is not in the DOM")}calculateMonthlyRepaymentInterest(){const t=this.calculateMortgageAmount(),e=this.calculateMontlyInterestRate();if(void 0===t||void 0===e)return;const r=t*e;return this.roundUpToTwoDecimals(r)}calculateTotalRepaymentInterest(){const t=this.calculateMortgageAmount(),e=this.calculateTotalRepayment();if(void 0===t||void 0===e)return;const r=e-t;return this.roundUpToTwoDecimals(r)}calculateMonthlyRepayment(){const t=this.calculateMortgageAmount(),e=this.calculateMontlyInterestRate(),r=this.calculateTotalNumberOfPayments();if(void 0===t||void 0===e||void 0===r)return;const o=t*(e*(1+e)**r/((1+e)**r-1));return this.roundUpToTwoDecimals(o)}calculateTotalRepayment(){const t=this.calculateTotalNumberOfPayments(),e=this.calculateMonthlyRepayment();if(void 0===t||void 0===e)return;const r=e*t;return this.roundUpToTwoDecimals(r)}displayResults(){if(!this.monthlyField||!this.totalField)return void console.warn("Could not find display inputs in the DOM");let t,e;"interest"===this.mortgageType?(t=this.calculateMonthlyRepaymentInterest(),e=this.calculateTotalRepaymentInterest()):"repayment"===this.mortgageType&&(t=this.calculateMonthlyRepayment(),e=this.calculateTotalRepayment()),void 0!==t&&void 0!==e?(this.historyArrayIndex=0,this.monthlyField.value=this.currency+r.format(t),this.totalField.value=this.currency+r.format(e),this.saveCalculationResult(),this.showResult()):this.hideResult()}roundUpToTwoDecimals(t){return Math.ceil(100*t)/100}calculateMortgageAmount(){const t=this.validateInput(this.mortgageAmountField,!0);if("number"==typeof t&&t<1e10)return t}calculateMontlyInterestRate(){const t=this.validateInput(this.mortgageRateField);if("number"==typeof t&&t<101)return t/12/100}calculateTotalNumberOfPayments(){const t=this.validateInput(this.mortgageTermField);if("number"==typeof t&&t<100)return 12*t}setupMortgageTypeSelection(){this.mortgageTypeBtns?this.mortgageTypeBtns.forEach((t=>{t.checked&&(this.mortgageType=t.id),t.addEventListener("change",(t=>{const e=t.target;e.checked&&(this.mortgageType=e.id)}))})):console.warn("Radio buttons are not found in the DOM!")}setupMortgageCurrencySelection(){this.currencyBtns&&this.currencySymbol?this.currencyBtns.forEach((t=>{t.checked&&(this.convertCurrency(this.currency,t.value),this.currency=t.value,this.currencySymbol.textContent=t.value),t.addEventListener("change",(t=>{const e=t.target;e.checked&&(this.convertCurrency(this.currency,e.value),this.currency=e.value,this.currencySymbol.textContent=e.value)}))})):console.warn("Radio buttons or currency span are not found in the DOM!")}getConversionRate(t,e){const r=`${t}_${e}`;return this.conversionRates.get(r)}convertCurrency(t,e){if(!this.amountField)return void console.warn("Amount field is not found");let o=this.amountField.value;if(o=o.replace(/[,]/g,""),isNaN(Number(o))||""===o)return void console.warn("Amount field is NaN");const n=this.getConversionRate(t,e),i=Number(o);void 0!==n?this.amountField.value=`${r.format(this.roundUpToTwoDecimals(i*n))}`:console.warn("Amount field undefined")}displayError(t,e){const r=e.closest(this.inputParentSelector),o=null==r?void 0:r.querySelector(this.errorHolderSelector);null==r||r.classList.add(this.inputErrorClass),o?o.textContent=t:console.warn("Couldn't find the error field")}resetErrorField(t){const e=t.closest(this.inputParentSelector),r=null==e?void 0:e.querySelector(this.errorHolderSelector);null==e||e.classList.remove(this.inputErrorClass),r?r.textContent="":console.warn("Couldn't find the error field")}validateInput(t,e=!1){if(!t)return void console.warn("Couldn't find the input field");let r=t.value.trim();if(e&&(r=r.replace(/[,]/g,"")),""===r){const e="Please fill in this field!";return void this.displayError(e,t)}const o=Number(r);if(isNaN(o)){const e="Please enter a valid number!";this.displayError(e,t)}else if(o<0){const e="The number should not be negative!";this.displayError(e,t)}else if("amount"===t.name&&o>1e10){const e="The amount is too large!";this.displayError(e,t)}else if("term"===t.name&&o>100){const e="The term is too large!";this.displayError(e,t)}else{if(!("rate"===t.name&&o>100))return this.resetErrorField(t),o;{const e="The rate is too high!";this.displayError(e,t)}}}}}},e={};function r(o){var n=e[o];if(void 0!==n)return n.exports;var i=e[o]={exports:{}};return t[o].call(i.exports,i,i.exports,r),i.exports}r.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r(156)})();