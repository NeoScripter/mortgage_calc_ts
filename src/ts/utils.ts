const NUMBER_FORMATTER = new Intl.NumberFormat(undefined);

type CalculationResult = {
    amount: string,
    term: string,
    rate: string,
    type: string,
    currency: string,
    monthly: string,
    total: string
}

export default class CalculatorHanlder {
    resultsPreview: HTMLElement | null;
    resultsPanel: HTMLElement | null;
    calculateBtn: HTMLElement | null;
    amountField: HTMLInputElement | null;
    hiddenPreviewClass: string;
    inputErrorClass: string;
    inputTextFields: NodeListOf<HTMLInputElement> | null;

    currency: string;
    currencyBtns: NodeListOf<HTMLInputElement> | null;
    currencySymbol: HTMLElement | null;

    errorHolderSelector: string;
    inputParentSelector: string;
    radioBtnErrorField: string;

    mortgageType: string;
    mortgageTypeBtns: NodeListOf<HTMLInputElement> | null;

    mortgageAmountField: HTMLInputElement | null;
    mortgageTermField: HTMLInputElement | null;
    mortgageRateField: HTMLInputElement | null;

    totalField: HTMLInputElement | null;
    monthlyField: HTMLInputElement | null;

    conversionRates: Map<string, number>;

    clearBtn: HTMLElement | null;
    showHistoryBtn: HTMLElement | null;

    historyArrayIndex: number;

    constructor() {
        this.resultsPreview = document.querySelector('.results__preview');
        this.resultsPanel = document.querySelector('.results__wrapper');
        this.calculateBtn = document.querySelector('.calc__calculate-btn');
        this.hiddenPreviewClass = 'results__preview--hidden';

        this.inputTextFields = document.querySelectorAll('input[type="text"]');
        this.errorHolderSelector = '.calc__error';
        this.inputParentSelector = '.calc__field';  
        this.inputErrorClass = 'calc__field--error';
        this.radioBtnErrorField = '.calc__radio-field .calc__error';  

        this.mortgageType = 'repayment';
        this.mortgageTypeBtns = document.querySelectorAll('input[name="type"]');

        this.currency = '£';
        this.currencyBtns = document.querySelectorAll('input[name="currency"]');
        this.currencySymbol = document.querySelector('#currency-symbol');

        this.mortgageAmountField = document.querySelector('input[name="amount"]');
        this.mortgageTermField = document.querySelector('input[name="term"]');
        this.mortgageRateField = document.querySelector('input[name="rate"]');

        this.monthlyField = document.querySelector('#monthlyResult');
        this.totalField = document.querySelector('#totalResult');

        this.amountField = document.querySelector('input[name="amount"]');
        this.clearBtn = document.querySelector("#clear-all-btn");
        this.showHistoryBtn = document.querySelector('.calc__history-btn');
        this.conversionRates = new Map<string, number>([
            // USD to other currencies
            ['$_€', 0.85], // USD to Euro
            ['$_£', 0.75], // USD to British Pound

            // Euro to other currencies
            ['€_$', 1.18], // Euro to USD
            ['€_£', 0.88], // Euro to British Pound

            // British Pound to other currencies
            ['£_$', 1.33], // British Pound to USD
            ['£_€', 1.14], // British Pound to Euro
        ]);

        this.historyArrayIndex = 0;
    }

    // Initialize the Class

    init() {
        this.calculate();
        this.setupMortgageTypeSelection();
        this.setupMortgageCurrencySelection();
        this.clearFields();
        this.setupHistoryBtnEventListener();
        this.hideDisplayOnInput();
    }

    // Final Methods

    calculate() {
        if (!this.calculateBtn) {
            console.warn('Button or panel are not found in the DOM!');
            return;
        }

        this.calculateBtn.addEventListener('click', () => {
            this.displayResults();
        })
    }

    showResult() {
        if (!this.resultsPreview) {
            console.warn('Panel is not found in the DOM!');
            return;
        }

        this.resultsPreview.classList.remove(this.hiddenPreviewClass);
    }

    hideResult() {
        if (!this.resultsPreview) {
            console.warn('Panel is not found in the DOM!');
            return;
        }

        this.resultsPreview.classList.add(this.hiddenPreviewClass);
    }

    // Hide the Display when the input changes

    hideDisplayOnInput() {
        if (!this.inputTextFields) {
            console.warn('Input fields not found!')
            return
        }

        this.inputTextFields.forEach(field => {
            field.addEventListener('input', () => {
                this.hideResult();
            })
        })
    }

    // Display the Result from History

    setupHistoryBtnEventListener() {
        if (!this.showHistoryBtn) {
            console.warn('Button not found!')
            return
        }

        this.showHistoryBtn.addEventListener('click', () => {
            this.showPreviousResult();
        })
    }

    showPreviousResult() {
        if (!this.mortgageAmountField || !this.mortgageTermField || !this.mortgageRateField || !this.monthlyField || !this.totalField) {
            console.warn('Input fields not found!')
            return
        }

        const prevResults: Array<CalculationResult> = this.getResultsFromLocalStorage();
        const prevCalculation = prevResults[this.historyArrayIndex];

        if (!prevCalculation) return

        console.log(prevCalculation);

        this.mortgageAmountField.value = prevCalculation.amount;
        this.mortgageTermField.value = prevCalculation.term;
        this.mortgageRateField.value = prevCalculation.rate;
        this.monthlyField.value = prevCalculation.monthly;
        this.totalField.value = prevCalculation.total;

        const mortgageTypeBtn: HTMLInputElement | null = document.querySelector(`#${prevCalculation.type}`);
        const mortgageCurrencyBtn: HTMLInputElement | null = document.querySelector(`input[value="${prevCalculation.currency}"]`);

        if (!mortgageTypeBtn || !mortgageCurrencyBtn) {
            console.warn('Radio button not found!')
            return
        }

        mortgageTypeBtn.checked = true;
        mortgageCurrencyBtn.checked = true;
        this.historyArrayIndex++;
        this.showResult();
    }

    // Save the Result

    saveCalculationResult() {
        if (!this.mortgageAmountField || !this.mortgageTermField || !this.mortgageRateField || !this.monthlyField || !this.totalField) return

        const inputData: CalculationResult = {
            amount: this.mortgageAmountField.value,
            term: this.mortgageTermField.value,
            rate: this.mortgageRateField.value,
            type: this.mortgageType,
            currency: this.currency,
            monthly: this.monthlyField.value,
            total: this.totalField.value
        };

        this.setResultsToLocalStorage(inputData);
    }

    getResultsFromLocalStorage(): Array<CalculationResult> {
        const mortgageCalculations = localStorage.getItem('mortgageCalculations');
        
        const parsedData = mortgageCalculations ? JSON.parse(mortgageCalculations) : [];
        
        return Array.isArray(parsedData) ? parsedData : [];
    }
    
    setResultsToLocalStorage(mortgageCalculations: CalculationResult): void {
        const prevResults: Array<CalculationResult> = this.getResultsFromLocalStorage();
    
        prevResults.unshift(mortgageCalculations);
    
        if (prevResults.length > 10) {
            prevResults.pop(); 
        }
    
        localStorage.setItem('mortgageCalculations', JSON.stringify(prevResults));
    }


    // Clear Fields 

    clearFields() {
        if (!this.clearBtn) {
            console.warn('Button is not in the DOM');
            return;
        }
        this.clearBtn.addEventListener('click', () => {
            if (!this.inputTextFields) {
                console.warn('Inputs are not in the DOM');
                return;
            }
            this.inputTextFields.forEach(input => {
                input.value = '';
            });
            this.hideResult();
        })
    }

    // Calculation Main Methods

    calculateMonthlyRepaymentInterest() {
        const mortgageAmount = this.calculateMortgageAmount();
        const monthlyInterestRate = this.calculateMontlyInterestRate();
    
        if (mortgageAmount === undefined || monthlyInterestRate === undefined) {
            return;
        }
    
        const monthlyInterestPayment = mortgageAmount * monthlyInterestRate;
    
        return this.roundUpToTwoDecimals(monthlyInterestPayment);
    }

    calculateTotalRepaymentInterest() {
        const mortgageAmount = this.calculateMortgageAmount();
        const totalRepayment = this.calculateTotalRepayment();
    
        if (mortgageAmount === undefined || totalRepayment === undefined) {
            return;
        }
    
        const totalInterest = totalRepayment - mortgageAmount;
    
        return this.roundUpToTwoDecimals(totalInterest);
    }

    calculateMonthlyRepayment() {
        const mortgageAmount = this.calculateMortgageAmount();
        const monthlyInterestRate = this.calculateMontlyInterestRate();
        const totalNumberOfPayments = this.calculateTotalNumberOfPayments();

        if (mortgageAmount === undefined || monthlyInterestRate === undefined || totalNumberOfPayments === undefined) {
            return;
        }

        const monthlyRepayment = mortgageAmount * 
        ((monthlyInterestRate * (1 + monthlyInterestRate) ** totalNumberOfPayments) 
        / ((1 + monthlyInterestRate) ** totalNumberOfPayments - 1));

        return this.roundUpToTwoDecimals(monthlyRepayment);
    }

    calculateTotalRepayment() {
        const totalNumberOfPayments = this.calculateTotalNumberOfPayments();
        const monthlyRepayment = this.calculateMonthlyRepayment(); 
    
        if (totalNumberOfPayments === undefined || monthlyRepayment === undefined) {
            return;
        }
    
        const totalRepayment = monthlyRepayment * totalNumberOfPayments;
        return this.roundUpToTwoDecimals(totalRepayment);
    }

    // Display update methods

    displayResults() {
        if (!this.monthlyField || !this.totalField) {
            console.warn("Could not find display inputs in the DOM");
            return;
        }
        let monthlyInterest;
        let totalInterest;

        if (this.mortgageType === 'interest') {
            monthlyInterest = this.calculateMonthlyRepaymentInterest();
            totalInterest = this.calculateTotalRepaymentInterest();
        } else if (this.mortgageType === 'repayment') {
            monthlyInterest = this.calculateMonthlyRepayment();
            totalInterest = this.calculateTotalRepayment();
        }

        if (monthlyInterest === undefined || totalInterest === undefined) {
            this.hideResult();
            return;
        }

        this.historyArrayIndex = 0;
        this.monthlyField.value = this.currency + NUMBER_FORMATTER.format(monthlyInterest);
        this.totalField.value = this.currency + NUMBER_FORMATTER.format(totalInterest);
        this.saveCalculationResult();
        this.showResult();
    }

    // Calculation Helpers

    roundUpToTwoDecimals(num: number): number {
        return Math.ceil(num * 100) / 100;
    }

    calculateMortgageAmount() {
        const fieldValue = this.validateInput(this.mortgageAmountField, true);
        if (typeof(fieldValue) === 'number' && fieldValue < 10000000000) {
            return fieldValue;
        }
        return
    }

    calculateMontlyInterestRate() {
        const fieldValue = this.validateInput(this.mortgageRateField);
        if (typeof(fieldValue) === 'number' && fieldValue < 101) {
            return fieldValue / 12 / 100;
        }
        return
    }

    calculateTotalNumberOfPayments() {
        const fieldValue = this.validateInput(this.mortgageTermField);
        if (typeof(fieldValue) === 'number' && fieldValue < 100) {
            return fieldValue * 12;
        }
        return
    }

    // Handle Mortgage Type Field

    setupMortgageTypeSelection() {
        if (!this.mortgageTypeBtns) {
            console.warn('Radio buttons are not found in the DOM!');
            return;
        }
        this.mortgageTypeBtns.forEach((radio) => {
            if (radio.checked) {
                this.mortgageType = radio.id;
            }
            radio.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                if (target.checked) {
                    this.mortgageType = target.id;
                }
            });
        });
    }

    // Handle Currency Field

    setupMortgageCurrencySelection() {
        if (!this.currencyBtns || !this.currencySymbol) {
            console.warn('Radio buttons or currency span are not found in the DOM!');
            return;
        }
        this.currencyBtns.forEach((radio) => {
            if (radio.checked) {
                this.convertCurrency(this.currency, radio.value);
                this.currency = radio.value;
                this.currencySymbol!.textContent = radio.value;
            }
            radio.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                if (target.checked) {
                    this.convertCurrency(this.currency, target.value);
                    this.currency = target.value;
                    this.currencySymbol!.textContent = target.value;
                }
            });
        });
    }

    // Handle Currency Conversion

    getConversionRate(fromCurrency: string, toCurrency: string): number | undefined {
        const key = `${fromCurrency}_${toCurrency}`;
        return this.conversionRates.get(key);
    }

    convertCurrency(fromCurrency: string, toCurrency: string) {
        if (!this.amountField) {
            console.warn("Amount field is not found");
            return;
        }
        let currentValue = this.amountField.value;
        currentValue = currentValue.replace(/[,]/g, '');
        if (isNaN(Number(currentValue)) || currentValue === '') {
            console.warn("Amount field is NaN");
            return;
        }
        const rate = this.getConversionRate(fromCurrency, toCurrency);
        const amount = Number(currentValue);
        if (rate === undefined) {
            console.warn("Amount field undefined");
            return;
        }
        this.amountField.value = `${NUMBER_FORMATTER.format(this.roundUpToTwoDecimals(amount * rate))}`;
    }

    // Handle Numberic Fields

    displayError(errorMessage: string, element: HTMLInputElement) {
        const inputParent = element.closest(this.inputParentSelector);
        const errorField = inputParent?.querySelector(this.errorHolderSelector);
        inputParent?.classList.add(this.inputErrorClass);
        if (!errorField) {
            console.warn(`Couldn't find the error field`);
            return;
        }
        errorField.textContent = errorMessage;
    }

    resetErrorField(element: HTMLInputElement) {
        const inputParent = element.closest(this.inputParentSelector);
        const errorField = inputParent?.querySelector(this.errorHolderSelector);
        inputParent?.classList.remove(this.inputErrorClass);
        if (!errorField) {
            console.warn(`Couldn't find the error field`);
            return;
        }
        errorField.textContent = '';
    }

    validateInput(inputElement: HTMLInputElement | null, removeCommas: boolean = false): number | void {
        if (!inputElement) {
            console.warn(`Couldn't find the input field`);
            return;
        }
        let value: string = inputElement.value.trim(); 

        if (removeCommas) {
            value = value.replace(/[,]/g, '');
        }
        
        // Check if the input is empty
        if (value === '') {
            const errorMessage = 'Please fill in this field!';
            this.displayError(errorMessage, inputElement);
            return;
        }
    
        // Check if the input is a valid number
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const errorMessage = 'Please enter a valid number!';
            this.displayError(errorMessage, inputElement);
            return;
        }
    
        // Ensure the value is not a negative number
        if (numericValue < 0) {
            const errorMessage = 'The number should not be negative!';
            this.displayError(errorMessage, inputElement);
            return;
        }
    
        // Check for extremely large or small numbers (overflow/underflow protection)
        if (inputElement.name === 'amount' && numericValue > 10000000000) {
            const errorMessage = 'The amount is too large!';
            this.displayError(errorMessage, inputElement);
            return;
        }

        if (inputElement.name === 'term' && numericValue > 100) {
            const errorMessage = 'The term is too large!';
            this.displayError(errorMessage, inputElement);
            return;
        }

        if (inputElement.name === 'rate' && numericValue > 100) {
            const errorMessage = 'The rate is too high!';
            this.displayError(errorMessage, inputElement);
            return;
        }
    
        this.resetErrorField(inputElement);
        return numericValue;
    }
    
}