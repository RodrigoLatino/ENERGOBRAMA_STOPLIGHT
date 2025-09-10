// Оголошуємо клас IndicatorController для керування поведінкою "світлодіодних
// індикаторів" на вебсторінці – імітації людино-машинного інтерфейсу REX640
// https://uk.javascript.info/classes
class IndicatorController {
  // Визначаємо конструктор, який викликається при створенні нового екземпляра
  // https://uk.javascript.info/constructor-new
  constructor() {
    // Вибираємо всі елементи <p> всередині контейнера з класом REX640 та
    // перетворюємо NodeList у масив для використання методів масиву
    // https://uk.javascript.info/searching-elements-dom
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
    this.indicators = Array.from(document.querySelectorAll('.REX640 p'));
    // Ініціалізуємо масив можливих станів індикаторів
    this.states = [
      // Стан 0: вимкнено (off), без CSS-класу, із сірим кольором
      {className: '', color: '#a7aaad'},  // .REX640 p
      // Стан 1: червоний миготливий, із червоним відтінком за замовчуванням
      {className: 'red blinking', color: '#CC0000'},  // .REX640 p.red
      // Стан 2: жовтий миготливий, із жовтим відтінком за замовчуванням
      {className: 'yellow blinking', color: '#FFFF00'},  // .REX640 p.yellow
      // Стан 3: зелений миготливий, із зеленим відтінком за замовчуванням
      {className: 'green blinking', color: '#66FF00'}  // .REX640 p.green
    ];
    // Створюємо масив для збереження поточних станів усіх індикаторів,
    // заповнений нулями (тобто індикатори не світяться на старті)
    // https://uk.javascript.info/array-methods
    this.currentStates = new Array(this.indicators.length).fill(0);
    // Ініціалізуємо індекс поточного індикатора, який тестують
    this.currentIndicatorIndex = 0;  // починається з 0
    // Ініціалізуємо поточний тестовий стан (1 = червоний)
    this.currentTestState = 1;
    // Викликаємо метод init для ініціалізації індикаторів
    this.init();
  }

  // Визначаємо метод для налаштування індикаторів та додавання слухачів подій
  init() {
    // Перебираємо всі індикатори, надаючи елемент та його індекс
    this.indicators.forEach((indicator, index) => {
      // Оновлюємо вигляд індикатора на основі його поточного стану (див. нижче)
      this.updateIndicator(indicator, index);
      // Додаємо слухач події pointerenter для наведення вказівника миші, пера,
      // стилуса, сенсорного екрана https://uk.javascript.info/pointer-events
      indicator.addEventListener('pointerenter', () => {
        // Встановлюємо повну видимість (opacity 1.0) при наведенні
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style
        indicator.style.opacity = '1.0';
      });
      // Додаємо слухач події pointerleave для випадку, коли вказівник
      // покидає індикатор https://uk.javascript.info/pointer-events
      indicator.addEventListener('pointerleave', () => {
        // Перевіряємо, чи індикатор не має активних класів (red, yellow, green)
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
        if (!indicator.classList.contains('red') &&
          !indicator.classList.contains('yellow') &&
          !indicator.classList.contains('green')) {
          // встановлюємо напівпрозорість для неактивних індикаторів
          indicator.style.opacity = '0.4';
        }
      });
      // Додаємо слухач події click для перемикання стану в разі клацання
      // https://uk.javascript.info/event-details
      indicator.addEventListener('click', () => {
        // Викликаємо окремий метод switchState для зміни стану індикатора
        this.switchState(index);
      });
    });
  }

  // Визначаємо метод updateIndicator для оновлення візуального стану індикатора
  updateIndicator(indicator, index) {
    // Видаляємо всі можливі класи стану (red, yellow, green, blinking)
    indicator.classList.remove('red', 'yellow', 'green', 'blinking');
    // Отримуємо поточний стан індикатора з масиву currentStates
    const state = this.currentStates[index];
    // Перевіряємо, чи індикатор в активному стані (не вимкнений)
    if (state > 0) {
      // Додаємо CSS-класи відповідного стану (наприклад, 'red blinking')
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/classList#Methods
      indicator.classList.add(...this.states[state].className.split(' '));
      // Встановлюємо повну видимість для активних станів
      indicator.style.opacity = '1.0';
    } else {
      // Встановлюємо напівпрозорість для вимкненого стану
      indicator.style.opacity = '0.4';
    }
  }

  // Визначаємо метод switchState для зміни стану конкретного індикатора
  switchState(index) {
    // Циклічно змінюємо стан індикатора (0 -> 1 -> 2 -> 3 -> 0)
    this.currentStates[index] =
      (this.currentStates[index] + 1) % this.states.length;
    // Оновлюємо вигляд індикатора після зміни стану
    this.updateIndicator(this.indicators[index], index);
  }

  // Визначаємо метод acknowledgeAll для скидання всіх індикаторів до
  // вимкненого стану за допомогою кнопки "КВІТУВАТИ"
  acknowledgeAll() {
    // Перебираємо всі індикатори
    this.indicators.forEach((indicator, index) => {
      // Встановлюємо стан кожного індикатора на 0 (вимкнено)
      this.currentStates[index] = 0;
      // Оновлюємо вигляд індикатора
      this.updateIndicator(indicator, index);
    });
    // Скидаємо тестовий стан до 1 (червоний) для наступного тестування
    this.currentTestState = 1;
  }

  // Визначаємо метод testNext для послідовного тестування індикаторів
  testNext() {
    // Перевірка на випадок, якщо індикатори не знайдені в DOM
    if (this.indicators.length === 0) return;
    // Вимикаємо поточний тестовий індикатор (встановлюємо стан 0)
    this.currentStates[this.currentIndicatorIndex] = 0;
    // Оновлюємо вигляд поточного тестового індикатора (тобто початкового)
    this.updateIndicator(this.indicators[this.currentIndicatorIndex],
      this.currentIndicatorIndex);
    // Переходимо до наступного індикатора (циклічний ТК – "тестовий контроль")
    this.currentIndicatorIndex =
      (this.currentIndicatorIndex + 1) % this.indicators.length;
    // Встановлюємо тестовий стан для нового індикатора
    this.currentStates[this.currentIndicatorIndex] = this.currentTestState;
    // Оновлюємо вигляд нового тестового індикатора
    this.updateIndicator(this.indicators[this.currentIndicatorIndex],
      this.currentIndicatorIndex);
    // Циклічно змінюємо тестовий стан (1 -> 2 -> 3 -> 1), пропускаючи вимкнені
    this.currentTestState = (this.currentTestState % 3) + 1;
  }
}

// Створюємо екземпляр класу IndicatorController для керування індикаторами
const controller = new IndicatorController();

// Вибираємо кнопку з класом acknowledge-button (кнопка "КВІТУВАТИ")
const acknowledgeButton = document.querySelector('.acknowledge-button');
// Додаємо слухач події click для кнопки "КВІТУВАТИ"
// https://uk.javascript.info/introduction-browser-events
acknowledgeButton.addEventListener('click', () => {
  // Викликаємо метод acknowledgeAll для скидання всіх індикаторів
  controller.acknowledgeAll();
});

// Вибираємо кнопку з класом test-button (кнопка "ТЕСТУВАТИ")
const testButton = document.querySelector('.test-button');
// Додаємо слухач події click для кнопки "ТЕСТУВАТИ"
testButton.addEventListener('click', () => {
  // Викликаємо метод testNext для тестування наступного індикатора
  controller.testNext();
});
