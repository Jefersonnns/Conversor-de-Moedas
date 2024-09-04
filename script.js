document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const convertBtn = document.getElementById('convert-btn');
    const resultElement = document.getElementById('conversion-result');

    const fromCurrencyImg = document.getElementById('from-currency-img');
    const toCurrencyImg = document.getElementById('to-currency-img');

    const apiKey = '99ac4a94a52184d75a6f8147';
    const apiEndpoint = `https://v6.exchangerate-api.com/v6/${apiKey}/latest`;

    let currentCurrency = 'BRL';

    function formatCurrency(value, currency) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency
        }).format(value);
    }

    function updateFormats() {
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        amountInput.placeholder = formatCurrency(0, fromCurrency);
        currentCurrency = fromCurrency;
        formatAmountInput();
        
        fromCurrencyImg.src = fromCurrencySelect.options[fromCurrencySelect.selectedIndex].dataset.img;
        toCurrencyImg.src = toCurrencySelect.options[toCurrencySelect.selectedIndex].dataset.img;
    }

    function formatAmountInput() {
        let value = amountInput.value.replace(/[^\d]/g, '');
        if (value) {
            value = parseFloat(value) / 100;
            amountInput.value = formatCurrency(value, currentCurrency);
        }
    }

    function parseAmount(value) {
        return parseFloat(value.replace(/[^\d]/g, '')) / 100;
    }

    async function fetchExchangeRates(baseCurrency) {
        const response = await fetch(`${apiEndpoint}/${baseCurrency}`);
        const data = await response.json();
        return data.conversion_rates;
    }

    async function convertCurrency() {
        const amount = parseAmount(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount) || amount <= 0) {
            resultElement.textContent = 'Por favor, insira uma quantia válida.';
            return;
        }

        try {
            const rates = await fetchExchangeRates(fromCurrency);

            if (!rates[toCurrency]) {
                resultElement.textContent = 'Moeda não suportada.';
                return;
            }

            const conversionRate = rates[toCurrency];
            const convertedAmount = amount * conversionRate;
            resultElement.textContent = formatCurrency(convertedAmount, toCurrency);
        } catch (error) {
            resultElement.textContent = 'Erro ao buscar taxas de câmbio. Tente novamente mais tarde.';
            console.error('Erro ao buscar taxas de câmbio:', error);
        }
    }

    fromCurrencySelect.addEventListener('change', updateFormats);
    toCurrencySelect.addEventListener('change', updateFormats);

    // Adiciona eventos aos elementos
    amountInput.addEventListener('blur', formatAmountInput);
    convertBtn.addEventListener('click', convertCurrency);
});
