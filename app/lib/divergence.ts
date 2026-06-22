export type FieldKind = "text" | "textarea" | "select" | "multiselect" | "number" | "radio";

export type FieldOption = {
  label: string;
  value: string;
  hint?: string;
};

export type FieldValue = string | number | string[];

export type InterviewField = {
  key: string;
  label: string;
  kind: FieldKind;
  helper?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  options?: FieldOption[];
};

export type InterviewStep = {
  id: string;
  title: string;
  subtitle: string;
  fields: InterviewField[];
};

export type AnswersMap = Record<string, FieldValue>;

export type BehaviorLoop = {
  trigger: string;
  automatic_reaction: string;
  temporary_reward: string;
  price: string;
  loop_breaker: string;
};

export type StoryCard = {
  title: string;
  if_nothing_changes: string;
  if_i_start_now: string;
  main_risk: string;
  first_step: string;
};

export type DivergenceResult = {
  profile_title: string;
  archetype: string;
  confidence_level: "high" | "medium" | "low";
  short_summary: string;
  dark_future_letter: string;
  strong_future_letter: string;
  behavior_loop: BehaviorLoop;
  main_pattern: string;
  main_risk: string;
  main_strength: string;
  first_72h_step: string;
  if_then_plan: string;
  story_card: StoryCard;
  disclaimer: string;
};

export const INTERVIEW_STEPS: InterviewStep[] = [
  {
    id: "context",
    title: "Контекст",
    subtitle: "Кто ты сейчас и в какой реальности живёшь.",
    fields: [
      { key: "name", label: "Как тебя зовут?", kind: "text", required: true, placeholder: "Имя" },
      {
        key: "age",
        label: "Сколько тебе лет?",
        kind: "number",
        required: true,
        placeholder: "30",
      },
      {
        key: "current_role",
        label: "Чем ты сейчас занимаешься?",
        kind: "select",
        required: true,
        options: [
          { label: "Учусь", value: "Учусь" },
          { label: "Работаю по найму", value: "Работаю по найму" },
          { label: "Работаю на себя", value: "Работаю на себя" },
          { label: "Строю бизнес", value: "Строю бизнес" },
          { label: "В поиске себя", value: "В поиске себя" },
          { label: "В переходном периоде", value: "В переходном периоде" },
          { label: "Другое", value: "Другое" },
        ],
      },
      {
        key: "current_life_description",
        label: "Как бы ты описал свою жизнь сейчас одним честным предложением?",
        kind: "textarea",
        required: true,
        minLength: 20,
        placeholder: "Без украшений, как есть.",
      },
      {
        key: "current_pressure",
        label: "Что сейчас сильнее всего давит?",
        kind: "multiselect",
        required: true,
        options: [
          { label: "Деньги", value: "Деньги" },
          { label: "Работа", value: "Работа" },
          { label: "Учёба", value: "Учёба" },
          { label: "Отношения", value: "Отношения" },
          { label: "Семья", value: "Семья" },
          { label: "Здоровье / энергия", value: "Здоровье / энергия" },
          { label: "Неопределённость", value: "Неопределённость" },
          { label: "Теряю время", value: "Ощущение, что теряю время" },
          { label: "Страх ошибиться", value: "Страх ошибиться" },
          { label: "Нет направления", value: "Отсутствие направления" },
          { label: "Другое", value: "Другое" },
        ],
      },
    ],
  },
  {
    id: "goal",
    title: "Цель",
    subtitle: "Что ты хочешь, но пока не можешь к этому подступиться.",
    fields: [
      {
        key: "blocked_goal",
        label: "Какая цель у тебя есть, но ты никак не можешь к ней нормально подступиться?",
        kind: "textarea",
        required: true,
        minLength: 20,
        placeholder: "Что буксует сильнее всего?",
      },
      {
        key: "goal_importance",
        label: "Почему эта цель для тебя важна?",
        kind: "textarea",
        required: true,
        minLength: 20,
      },
      {
        key: "desired_self_3_years",
        label: "Каким человеком ты хочешь стать через 3 года?",
        kind: "textarea",
        required: true,
        minLength: 20,
      },
      {
        key: "progress_marker",
        label: "Что должно измениться, чтобы ты сам сказал: “Да, я наконец сдвинулся”?",
        kind: "textarea",
        required: true,
        minLength: 20,
      },
      {
        key: "self_proof",
        label: "Что ты хочешь доказать себе?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
    ],
  },
  {
    id: "avoidance",
    title: "Привычки и избегание",
    subtitle: "Что ты делаешь вместо движения и чем это оправдываешь.",
    fields: [
      {
        key: "avoidance_actions",
        label: "Что ты чаще всего делаешь вместо важного дела?",
        kind: "multiselect",
        required: true,
        options: [
          { label: "Залипаю в телефоне", value: "Залипаю в телефоне" },
          { label: "Смотрю видео / сериалы", value: "Смотрю видео / сериалы" },
          { label: "Играю", value: "Играю" },
          { label: "Ем, чтобы отвлечься", value: "Ем не потому что голоден, а чтобы отвлечься" },
          { label: "Делаю мелкие неважные дела", value: "Делаю мелкие неважные дела" },
          { label: "Смотрю обучение вместо действия", value: "Смотрю обучающие материалы вместо действия" },
          { label: "Обсуждаю идеи, но не делаю", value: "Обсуждаю идеи, но не делаю" },
          { label: "Помогаю другим вместо себя", value: "Помогаю другим вместо себя" },
          { label: "Ухожу в работу", value: "Ухожу в работу, чтобы не решать личное" },
          { label: "Строю новый план", value: "Строю новый план" },
          { label: "Сплю / лежу без сил", value: "Сплю / лежу без сил" },
          { label: "Другое", value: "Другое" },
        ],
      },
      {
        key: "drop_moment",
        label: "В какой момент ты чаще всего сливаешься?",
        kind: "select",
        required: true,
        options: [
          { label: "Перед самым стартом", value: "Перед самым стартом" },
          { label: "Когда надо показать результат людям", value: "Когда надо показать результат людям" },
          { label: "Когда становится скучно", value: "Когда становится скучно" },
          { label: "Когда не получается быстро", value: "Когда не получается быстро" },
          { label: "Когда появляется критика", value: "Когда появляется критика" },
          { label: "Когда нужно делать рутину", value: "Когда нужно делать рутину" },
          { label: "Когда нет поддержки", value: "Когда нет поддержки" },
          { label: "Когда появляется новый интерес", value: "Когда появляется новый интерес" },
          { label: "Когда надо просить деньги / продавать", value: "Когда надо просить деньги / продавать" },
          { label: "Когда надо выбрать одно направление", value: "Когда надо выбрать одно направление" },
        ],
      },
      {
        key: "inner_excuse",
        label: "Какая фраза чаще всего звучит в голове, когда ты откладываешь?",
        kind: "select",
        required: true,
        options: [
          { label: "Я ещё не готов", value: "Я ещё не готов" },
          { label: "Сейчас не время", value: "Сейчас не время" },
          { label: "Нужно ещё разобраться", value: "Нужно ещё разобраться" },
          { label: "У меня нет сил", value: "У меня нет сил" },
          { label: "С понедельника начну", value: "С понедельника начну" },
          { label: "Сначала надо привести жизнь в порядок", value: "Сначала надо привести жизнь в порядок" },
          { label: "Вдруг не получится", value: "Вдруг не получится" },
          { label: "Это всё равно никому не нужно", value: "Это всё равно никому не нужно" },
          { label: "Я не знаю, с чего начать", value: "Я не знаю, с чего начать" },
          { label: "У других лучше", value: "У других лучше" },
          { label: "Мне уже поздно", value: "Мне уже поздно" },
          { label: "Мне ещё рано", value: "Мне ещё рано" },
        ],
      },
      {
        key: "habit_reward",
        label: "Что ты получаешь от этой привычки прямо сейчас?",
        kind: "multiselect",
        required: true,
        options: [
          { label: "Временное спокойствие", value: "Временное спокойствие" },
          { label: "Избегание стыда", value: "Избегание стыда" },
          { label: "Ощущение контроля", value: "Ощущение контроля" },
          { label: "Удовольствие", value: "Удовольствие" },
          { label: "Отдых", value: "Отдых" },
          { label: "Возможность не выбирать", value: "Возможность не выбирать" },
          { label: "Возможность не сталкиваться с оценкой", value: "Возможность не сталкиваться с оценкой" },
          { label: "Возможность не рисковать", value: "Возможность не рисковать" },
          { label: "Ощущение, что я готовлюсь", value: "Ощущение, что я “готовлюсь”" },
          { label: "Ничего, просто автоматизм", value: "Ничего, просто автоматизм" },
        ],
      },
      {
        key: "habit_price",
        label: "Какую цену ты платишь за эту привычку?",
        kind: "textarea",
        required: true,
        minLength: 20,
      },
      {
        key: "failed_change_attempt",
        label: "Что ты уже пробовал менять, но не удержал?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
      {
        key: "failed_change_reason",
        label: "Почему, по-твоему, не удержал?",
        kind: "multiselect",
        required: true,
        options: [
          { label: "Слишком резко начал", value: "Слишком резко начал" },
          { label: "Не было системы", value: "Не было системы" },
          { label: "Не было поддержки", value: "Не было поддержки" },
          { label: "Слишком много хотел сразу", value: "Слишком много хотел сразу" },
          { label: "Не убрал триггеры", value: "Не убрал триггеры" },
          { label: "Не понимал, зачем", value: "Не понимал, зачем" },
          { label: "Сорвался один раз и бросил полностью", value: "Сорвался один раз и бросил полностью" },
          { label: "Не было времени", value: "Не было времени" },
          { label: "Не было энергии", value: "Не было энергии" },
          { label: "Цель была не моя", value: "Цель была не моя" },
          { label: "Другое", value: "Другое" },
        ],
      },
    ],
  },
  {
    id: "strengths",
    title: "Опоры",
    subtitle: "Что у тебя уже работает и на что можно опереться.",
    fields: [
      {
        key: "existing_positive_habits",
        label: "Что у тебя уже получается делать регулярно, даже если не идеально?",
        kind: "multiselect",
        required: true,
        options: [
          { label: "Работать", value: "Работать" },
          { label: "Учиться", value: "Учиться" },
          { label: "Тренироваться", value: "Тренироваться" },
          { label: "Заботиться о семье", value: "Заботиться о семье" },
          { label: "Вести проекты", value: "Вести проекты" },
          { label: "Создавать контент", value: "Создавать контент" },
          { label: "Помогать людям", value: "Помогать людям" },
          { label: "Читать / развиваться", value: "Читать / развиваться" },
          { label: "Зарабатывать", value: "Зарабатывать" },
          { label: "Планировать", value: "Планировать" },
          { label: "Доводить задачи", value: "Доводить задачи" },
          { label: "Общаться / строить связи", value: "Общаться / строить связи" },
          { label: "Другое", value: "Другое" },
        ],
      },
      {
        key: "discipline_area",
        label: "В какой сфере ты уже проявлял дисциплину?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
      {
        key: "strengths",
        label: "Что у тебя получается лучше, чем у большинства людей?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
      {
        key: "praise_from_others",
        label: "За что тебя чаще всего хвалят?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
      {
        key: "authentic_moments",
        label: "Когда ты чувствуешь себя сильным и настоящим?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
      {
        key: "long_term_interest",
        label: "Что ты можешь делать долго, даже если нет быстрой награды?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
    ],
  },
  {
    id: "environment",
    title: "Среда и триггеры",
    subtitle: "Где ты теряешь управление и что тебя включает.",
    fields: [
      {
        key: "loss_of_control_time",
        label: "Когда в течение дня ты чаще всего теряешь контроль над собой?",
        kind: "select",
        required: true,
        options: [
          { label: "Утром", value: "Утром" },
          { label: "Днём", value: "Днём" },
          { label: "Вечером", value: "Вечером" },
          { label: "Ночью", value: "Ночью" },
          { label: "После работы / учёбы", value: "После работы / учёбы" },
          { label: "После конфликта", value: "После конфликта" },
          { label: "Когда остаюсь один", value: "Когда остаюсь один" },
          { label: "Когда устаю", value: "Когда устаю" },
          { label: "Когда появляется свободное время", value: "Когда появляется свободное время" },
          { label: "Когда нужно начать сложную задачу", value: "Когда нужно начать сложную задачу" },
        ],
      },
      {
        key: "triggers",
        label: "Что чаще всего запускает твой срыв или откат?",
        kind: "multiselect",
        required: true,
        options: [
          { label: "Усталость", value: "Усталость" },
          { label: "Одиночество", value: "Одиночество" },
          { label: "Тревога", value: "Тревога" },
          { label: "Скука", value: "Скука" },
          { label: "Критика", value: "Критика" },
          { label: "Сравнение с другими", value: "Сравнение с другими" },
          { label: "Хаос вокруг", value: "Хаос вокруг" },
          { label: "Нет понятного плана", value: "Отсутствие понятного плана" },
          { label: "Телефон рядом", value: "Телефон рядом" },
          { label: "Компания людей", value: "Компания людей" },
          { label: "Стресс", value: "Стресс" },
          { label: "Дедлайн", value: "Дедлайн" },
          { label: "Слишком большая задача", value: "Слишком большая задача" },
        ],
      },
      {
        key: "usual_evening",
        label: "Как выглядит твой обычный вечер?",
        kind: "textarea",
        required: true,
        minLength: 20,
      },
      {
        key: "usual_morning",
        label: "Как выглядит твоё обычное утро?",
        kind: "textarea",
        required: true,
        minLength: 20,
      },
      {
        key: "environment_keeps_current_self",
        label: "Кто или что в твоём окружении поддерживает твою текущую версию?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
      {
        key: "environment_supports_growth",
        label: "Кто или что помогает тебе становиться лучше?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
    ],
  },
  {
    id: "truth",
    title: "Самообман и развилка",
    subtitle: "Чего ты боишься, что на самом деле уже знаешь, и какой первый шаг возможен.",
    fields: [
      {
        key: "rationalized_excuse",
        label: "Что ты объясняешь себе логично, хотя внутри понимаешь, что это оправдание?",
        kind: "textarea",
        required: true,
        minLength: 20,
      },
      {
        key: "fear_of_truth",
        label: "Что ты боишься узнать о себе, если всё-таки попробуешь?",
        kind: "multiselect",
        required: true,
        options: [
          { label: "Что я не такой способный, как думал", value: "Что я не такой способный, как думал" },
          { label: "Что мне придётся работать больше", value: "Что мне придётся работать больше" },
          { label: "Что людям будет всё равно", value: "Что людям будет всё равно" },
          { label: "Что меня осудят", value: "Что меня осудят" },
          { label: "Что я сам себя тормозил", value: "Что я сам себя тормозил" },
          { label: "Что я выбрал не то", value: "Что я выбрал не то" },
          { label: "Что я потерял много времени", value: "Что я потерял много времени" },
          { label: "Что мне придётся менять окружение", value: "Что мне придётся менять окружение" },
          { label: "Что мне придётся отказаться от удобной роли", value: "Что мне придётся отказаться от удобной роли" },
          { label: "Другое", value: "Другое" },
        ],
      },
      {
        key: "disliked_self_version",
        label: "Какая версия тебя тебе самому неприятна?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
      {
        key: "close_person_view",
        label: "Если близкий человек честно описал бы твой главный тормоз, что бы он сказал?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
      {
        key: "worst_3_year_regret",
        label: "Если ничего не изменится, что через 3 года будет самым обидным?",
        kind: "textarea",
        required: true,
        minLength: 20,
      },
      {
        key: "life_scene",
        label: "Какая сцена больше похожа на твою жизнь сейчас?",
        kind: "select",
        required: true,
        options: [
          { label: "Стою перед дверью, но не открываю", value: "Стою перед дверью, но не открываю" },
          { label: "Бегу в разные стороны и не выбираю путь", value: "Бегу в разные стороны и не выбираю путь" },
          { label: "Несу на себе слишком много чужого", value: "Несу на себе слишком много чужого" },
          { label: "Сижу в комнате с планами, но не выхожу наружу", value: "Сижу в комнате с планами, но не выхожу наружу" },
          { label: "Еду в поезде, но не знаю, моя ли это станция", value: "Еду в поезде, но не знаю, моя ли это станция" },
          { label: "Строю что-то в одиночку и боюсь, что не выдержу", value: "Строю что-то в одиночку и боюсь, что не выдержу" },
          { label: "Держусь за стабильность, которая уже стала клеткой", value: "Держусь за стабильность, которая уже стала клеткой" },
          { label: "Вижу, куда надо идти, но жду разрешения", value: "Вижу, куда надо идти, но жду разрешения" },
          { label: "Тушу пожары и не строю свою жизнь", value: "Тушу пожары и не строю свою жизнь" },
          { label: "Начинаю заново, когда становится сложно", value: "Начинаю заново, когда становится сложно" },
        ],
      },
      {
        key: "bigger_fear",
        label: "Что для тебя страшнее?",
        kind: "select",
        required: true,
        options: [
          { label: "Попробовать и ошибиться", value: "Попробовать и ошибиться" },
          { label: "Остаться там же ещё на 3 года", value: "Остаться там же ещё на 3 года" },
          { label: "Услышать критику", value: "Услышать критику" },
          { label: "Понять, что цель была не моя", value: "Понять, что цель была не моя" },
          { label: "Потерять стабильность", value: "Потерять стабильность" },
          { label: "Потерять уважение к себе", value: "Потерять уважение к себе" },
        ],
      },
      {
        key: "first_72h_step",
        label: "Какой один шаг ты точно мог бы сделать за 72 часа?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
      {
        key: "first_step_obstacle",
        label: "Что может помешать тебе сделать этот шаг?",
        kind: "textarea",
        required: true,
        minLength: 10,
      },
      {
        key: "if_then_plan",
        label: "Составь простой план “если — то”.",
        kind: "textarea",
        required: true,
        minLength: 10,
        placeholder: "Если ________, то я ________.",
      },
      {
        key: "tone",
        label: "Каким тоном написать письмо?",
        kind: "radio",
        required: true,
        options: [
          { label: "Мягко", value: "Мягко" },
          { label: "Честно", value: "Честно" },
          { label: "Жёстко, но без унижения", value: "Жёстко, но без унижения" },
        ],
      },
    ],
  },
];

const NEGATIVE_TAGS = [
  ["avoidance_by_learning", ["Смотрю обучающие материалы вместо действия"]],
  ["perfectionism", ["Сначала надо привести жизнь в порядок", "Вдруг не получится", "Не было системы"]],
  ["fear_of_judgment", ["Когда надо показать результат людям", "Когда появляется критика", "Услышать критику"]],
  ["comfort_trap", ["Держусь за стабильность, которая уже стала клеткой", "Сейчас не время"]],
  ["scattered_focus", ["Строю новый план", "Когда появляется новый интерес", "Бегу в разные стороны и не выбираю путь"]],
  ["emotional_escape", ["Смотрю видео / сериалы", "Играю", "Ем не потому что голоден, а чтобы отвлечься"]],
  ["overresponsibility", ["Помогаю другим вместо себя", "Ухожу в работу, чтобы не решать личное", "Несу на себе слишком много чужого"]],
  ["low_energy_loop", ["Сплю / лежу без сил", "У меня нет сил", "Когда устаю"]],
  ["no_structure", ["Не было системы", "Нет понятного плана", "Когда нужно выбрать одно направление"]],
  ["external_validation", ["У других лучше", "Меня осудят", "Не понимаю, зачем", "Мне нужно разрешение"]],
  ["fear_of_selling", ["Когда надо просить деньги / продавать"]],
  ["restart_loop", ["Сорвался один раз и бросил полностью", "Начинаю заново, когда становится сложно"]],
] as const;

const POSITIVE_TAGS = [
  ["discipline_exists", ["Работать", "Тренироваться", "Планировать", "Доводить задачи"]],
  ["creative_energy", ["Создавать контент", "Идеи", "Креатив"]],
  ["social_support", ["Общаться / строить связи", "Поддержка", "Люди"]],
  ["analytical_strength", ["Разбираться", "Анализ", "Систем", "Факты"]],
  ["responsibility", ["Заботиться о семье", "Зарабатывать", "Несу на себе"]],
  ["resilience", ["Возвращаюсь", "Справляюсь", "Собираюсь"]],
  ["learning_drive", ["Учиться", "Читать / развиваться", "Обучение"]],
  ["leadership_potential", ["Вести проекты", "Решать", "Влияние"]],
  ["craft_focus", ["Мастерство", "Долго", "Глубоко", "Оттачивать"]],
  ["service_motive", ["Помогать людям", "Заботиться", "Поддержка"]],
] as const;

const TRIGGER_TAGS = [
  ["fatigue", ["Усталость"]],
  ["criticism", ["Критика", "Услышать критику"]],
  ["ambiguity", ["Неопределённость", "Нет понятного плана"]],
  ["boredom", ["Скука"]],
  ["loneliness", ["Одиночество", "Когда остаюсь один"]],
  ["deadline", ["Дедлайн"]],
  ["public_exposure", ["Когда надо показать результат людям"]],
  ["conflict", ["После конфликта"]],
  ["phone_access", ["Телефон рядом"]],
  ["lack_of_plan", ["Когда нужно начать сложную задачу", "Отсутствие понятного плана"]],
] as const;

export const DIVERGENCE_SYSTEM_PROMPT = [
  "Ты — ИИ-агент проекта «Развилка».",
  "",
  "Твоя задача — на основе ответов пользователя создать эмоциональный, честный, глубокий, но безопасный анализ двух вероятных траекторий будущего.",
  "",
  "Ты не предсказываешь судьбу. Ты анализируешь текущие привычки, цели, страхи, среду, повторяющиеся паттерны поведения, негативные и положительные привычки, самообман и сильные стороны пользователя.",
  "",
  "Главная цель результата — не напугать человека, а показать ему честное зеркало:",
  "1. к чему ведёт текущий паттерн;",
  "2. какую цену он уже платит;",
  "3. на какую сильную сторону можно опереться;",
  "4. какой один маленький шаг может изменить траекторию.",
  "",
  "Перед тем как писать ответ, молча собери внутри себя 6 вещей:",
  "- чего человек на самом деле хочет;",
  "- что он делает вместо движения;",
  "- как он оправдывает этот сдвиг в сторону отсрочки;",
  "- чего он избегает эмоционально или социально;",
  "- какую временную выгоду получает;",
  "- какую цену платит через месяцы и годы.",
  "Сначала найди главную петлю, затем выбери главную цену, затем выбери одну сильную опору, затем только после этого пиши текст.",
  "Не перечисляй шаги анализа в ответе. Не объясняй свою методологию. Не показывай внутренние расчёты.",
  "",
  "Стиль:",
  "- кинематографично, но не пафосно;",
  "- персонально, конкретно и наблюдательно;",
  "- глубоко, но без воды и без общих фраз;",
  "- честно, но без унижения;",
  "- без клише, эзотерики и мотивационного шума;",
  "- без медицинских и психологических диагнозов;",
  "- с ощущением: «больно, но я могу что-то изменить».",
  "",
  "Пиши как умный редактор и психолог-наблюдатель, а не как тестовый генератор.",
  "Письма из будущего должны звучать как живой человек, который прожил эти годы и пишет без редакторской полировки.",
  "Не делай текст слишком гладким, слишком правильным или слишком симметричным.",
  "Не начинай каждый абзац одинаково и не злоупотребляй связками вроде «самым важным было», «если бы я мог», «и только потом я понял».",
  "Лучше короткая, немного шероховатая, но живая фраза, чем идеально отполированный, безличный абзац.",
  "В письмах должны быть: конкретная интонация, бытовая правдоподобность, внутренний сдвиг и ощущение прожитого опыта.",
  "Каждый абзац должен добавлять новую мысль: один про механизм, один про цену, один про ветку будущего, один про точку разворота.",
  "Не повторяй одну и ту же идею разными словами.",
  "Не копируй формулировки из входных ответов или из scaffold-сидa; scaffold — это только структура, а не текст для заимствования.",
  "Избегай одинаковых начал предложений. Не открывай каждую фразу словом «Ты».",
  "Не превращай текст в перечень качеств или пересказ анкеты. Человек должен увидеть скрытую логику своей жизни, а не список собственных ответов.",
  "Если данных мало, говори об этом прямо и конкретно, не заполняй пустоту общими словами. Лучше честная недосказанность, чем шаблонная уверенность.",
  "",
  "Запрещено:",
  "- говорить «ты обречён»;",
  "- говорить «у тебя ничего не получится»;",
  "- использовать слова «неудачник», «сломанный», «бесполезный»;",
  "- делать выводы о депрессии, тревожном расстройстве, СДВГ или других медицинских/психологических состояниях;",
  "- усиливать безысходность;",
  "- давать опасные советы;",
  "- обещать гарантированный успех;",
  "- выдавать результат как точное предсказание будущего.",
  "",
  "Обязательно:",
  "- укажи, что это не точное предсказание, а вероятная траектория на основе ответов;",
  "- не пересказывай ответы, а извлекай повторяющийся паттерн и его цену;",
  "- связывай выводы с ответами пользователя через причинно-следственную связку, а не через цитирование;",
  "- показывай одну главную поведенческую петлю и не распыляйся на второстепенные;",
  "- назови главный самообман, который делает петлю устойчивой;",
  "- выделяй не только негативные привычки, но и настоящие опоры, которые уже есть;",
  "- в тёмной ветке опиши накопление последствий, а не абстрактный «плохой исход»;",
  "- в сильной ветке покажи, как маленькое действие меняет маршрут, а не обещай чудо;",
  "- каждая ветка должна звучать как письмо из будущего, но с разной оптикой и разной ценой;",
  "- дай один конкретный шаг на ближайшие 24–72 часа;",
  "- сделай текст таким, чтобы его хотелось сохранить или отправить другу.",
  "",
  "Формула анализа:",
  "1. Что человек хочет.",
  "2. Что он делает вместо движения.",
  "3. Как он это себе объясняет.",
  "4. Чего он на самом деле избегает.",
  "5. Какую временную выгоду получает.",
  "6. Какую цену платит.",
  "7. Какая сильная сторона может его вытащить.",
  "8. Какой первый шаг разрушит петлю.",
  "",
  "Качество ответа:",
  "- short_summary: 5–7 предложений, без воды, с главным конфликтом и одной развилкой;",
  "- dark_future_letter: 180–250 слов, с нарастающим эффектом, без морализаторства;",
  "- strong_future_letter: 180–250 слов, с ощущением реального сдвига, а не чудесного преображения;",
  "- behavior_loop: одна жёсткая связка trigger → reaction → reward → price → breaker;",
  "- main_pattern: один главный паттерн в одной фразе;",
  "- main_risk: один риск, который реально может реализоваться за 1–3 года;",
  "- main_strength: одна реальная опора, а не комплимент;",
  "- first_72h_step: один конкретный и выполнимый шаг;",
  "- story_card: коротко, сохраняемо, без повторения длинных формулировок из письма.",
  "",
  "Важно по глубине:",
  "- если видишь несколько возможных объяснений, выбирай наиболее вероятное и показывай его как гипотезу;",
  "- если человек хочет одно, но делает другое, это и есть центр анализа;",
  "- если ответы поверхностные, не притворяйся, что данных много;",
  "- если ответы очень насыщенные, показывай внутреннее противоречие, а не просто сильные стороны;",
  "- хорошая строка анализа обычно отвечает на вопрос: «что он защищает этой привычкой?»",
  "",
  "Плохой вывод:",
  "«Ты хочешь запустить проект, но боишься. Начни действовать.»",
  "",
  "Хороший вывод:",
  "«Ты хочешь запустить проект, но каждый раз уходишь в доработку и обучение, потому что там безопасно: пока ты готовишься, никто не может оценить твой реальный результат. Главный риск — не провал, а жизнь в вечной подготовке.»",
  "",
  "Ещё лучше:",
  "«Похоже, ты не избегал самого проекта — ты избегал момента, когда он перестаёт быть идеей и становится проверяемой реальностью. Именно поэтому ты так часто возвращаешься к обучению, планам и уточнениям: там можно оставаться умным и не встречаться с оценкой. Цена этого режима — не только время, но и постепенная потеря веры в собственный старт.»",
  "",
  "Выбери один архетип:",
  "1. Вечный стартёр",
  "2. Перфекционист в засаде",
  "3. Тихий заложник стабильности",
  "4. Хаотичный талант",
  "5. Человек чужих ожиданий",
  "6. Умный прокрастинатор",
  "7. Выгоревший тащер",
  "8. Бунтарь без системы",
  "9. Скрытый лидер",
  "10. Человек отложенной жизни",
  "",
  "Сформируй результат строго в JSON-формате:",
  "",
  "{",
  '  "profile_title": "Твоя развилка: ...",',
  '  "archetype": "...",',
  '  "confidence_level": "high | medium | low",',
  '  "short_summary": "5–7 предложений. Главный паттерн и почему будущее может пойти по двум веткам.",',
  '  "dark_future_letter": "Письмо от пользователя из будущего, если ничего не изменить. 180–250 слов. Эмоционально, но безопасно. Покажи реалистичную цену текущего паттерна.",',
  '  "strong_future_letter": "Письмо от пользователя из будущего, если он начнёт менять траекторию. 180–250 слов. Покажи, что изменение началось не с идеальности, а с одного конкретного действия.",',
  '  "behavior_loop": {',
  '    "trigger": "Что запускает старый паттерн.",',
  '    "automatic_reaction": "Что пользователь автоматически делает вместо важного.",',
  '    "temporary_reward": "Какую временную выгоду это даёт.",',
  '    "price": "Какую цену пользователь платит.",',
  '    "loop_breaker": "Какой маленький шаг разрывает петлю."',
  "  },",
  '  "main_pattern": "Один главный повторяющийся паттерн.",',
  '  "main_risk": "Главный риск на 1–3 года, если ничего не менять.",',
  '  "main_strength": "Одна сильная сторона, на которую можно опереться.",',
  '  "first_72h_step": "Один конкретный шаг на ближайшие 24–72 часа.",',
  '  "if_then_plan": "Если ..., то я ...",',
  '  "story_card": {',
  '    "title": "Моя развилка",',
  '    "if_nothing_changes": "Короткая фраза для сторис: если ничего не изменить...",',
  '    "if_i_start_now": "Короткая фраза для сторис: если начать сейчас...",',
  '    "main_risk": "Главный риск",',
  '    "first_step": "Первый шаг"',
  "  },",
  '  "disclaimer": "Это не точное предсказание и не психологический диагноз. Это вероятная траектория на основе твоих ответов."',
  "}",
  "",
  "Не добавляй текст вне JSON.",
].join("\n");

export function getStepByIndex(index: number) {
  return INTERVIEW_STEPS[Math.max(0, Math.min(INTERVIEW_STEPS.length - 1, index))];
}

export function getStepIndex(stepId: string) {
  return INTERVIEW_STEPS.findIndex((step) => step.id === stepId);
}

export function getFieldCount() {
  return INTERVIEW_STEPS.reduce((sum, step) => sum + step.fields.length, 0);
}

export function createEmptyAnswers() {
  const result: AnswersMap = {};
  for (const step of INTERVIEW_STEPS) {
    for (const field of step.fields) {
      result[field.key] = field.kind === "multiselect" ? [] : field.kind === "number" ? "" : "";
    }
  }
  return result;
}

export function normalizeValue(kind: FieldKind, value: FieldValue) {
  if (kind === "number") {
    return typeof value === "number" ? value : Number(String(value).trim());
  }

  if (kind === "multiselect") {
    return Array.isArray(value) ? value : [];
  }

  return String(value ?? "").trim();
}

export function validateField(field: InterviewField, value: FieldValue) {
  if (field.required) {
    if (field.kind === "multiselect") {
      if (!Array.isArray(value) || value.length === 0) {
        return "Выбери хотя бы один вариант.";
      }
    } else if (field.kind === "number") {
      if (value === "" || Number.isNaN(Number(value))) {
        return "Укажи число.";
      }
    } else if (!String(value ?? "").trim()) {
      return "Ответ не должен быть пустым.";
    }
  }

  if (field.kind === "textarea") {
    const text = String(value ?? "").trim();
    if ((field.minLength ?? 0) > 0 && text.length < (field.minLength ?? 0)) {
      return "Ответ слишком короткий. Напиши конкретнее — так письмо получится точнее.";
    }
  }

  return null;
}

export function validateStep(step: InterviewStep, answers: AnswersMap) {
  const fieldErrors: Record<string, string> = {};
  for (const field of step.fields) {
    const error = validateField(field, answers[field.key] ?? "");
    if (error) {
      fieldErrors[field.key] = error;
    }
  }
  return fieldErrors;
}

function containsAny(value: string, terms: readonly string[]) {
  return terms.some((term) => value.includes(term.toLowerCase()));
}

function extractText(answers: AnswersMap) {
  return Object.values(answers)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => String(value).toLowerCase())
    .join(" | ");
}

function getText(answers: AnswersMap, key: string) {
  const value = answers[key];
  return Array.isArray(value) ? value.join(", ") : String(value ?? "");
}

function getMulti(answers: AnswersMap, key: string) {
  const value = answers[key];
  return Array.isArray(value) ? value.map(String) : [];
}

function deriveTags(answers: AnswersMap) {
  const text = extractText(answers);
  const positiveSource = `${getText(answers, "strengths")} ${getText(answers, "praise_from_others")} ${getText(answers, "authentic_moments")} ${getText(answers, "long_term_interest")}`.toLowerCase();

  const negativeTags = NEGATIVE_TAGS.flatMap(([tag, terms]) => (containsAny(text, terms) ? [tag] : []));
  const positiveTags = POSITIVE_TAGS.flatMap(([tag, terms]) => (containsAny(positiveSource, terms) ? [tag] : []));
  const triggerTags = TRIGGER_TAGS.flatMap(([tag, terms]) => (containsAny(text, terms) ? [tag] : []));

  return {
    negativeTags,
    positiveTags,
    triggerTags,
  };
}

function countFilled(answers: AnswersMap) {
  return Object.values(answers).filter((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return String(value ?? "").trim().length > 0;
  }).length;
}

function confidenceLevel(answers: AnswersMap): "high" | "medium" | "low" {
  const filled = countFilled(answers);
  if (filled >= 30) return "high";
  if (filled >= 18) return "medium";
  return "low";
}

function pickArchetype(answers: AnswersMap, tags: ReturnType<typeof deriveTags>) {
  const negative = new Set(tags.negativeTags);
  const positive = new Set(tags.positiveTags);
  const trigger = new Set(tags.triggerTags);

  if (negative.has("restart_loop") && negative.has("no_structure")) return "Вечный стартёр";
  if (negative.has("perfectionism") && negative.has("fear_of_judgment")) return "Перфекционист в засаде";
  if (negative.has("comfort_trap")) return "Тихий заложник стабильности";
  if (negative.has("avoidance_by_learning") && positive.has("analytical_strength")) return "Умный прокрастинатор";
  if (negative.has("overresponsibility")) return "Выгоревший тащер";
  if (negative.has("external_validation") && negative.has("fear_of_judgment")) return "Человек чужих ожиданий";
  if (negative.has("scattered_focus")) return "Хаотичный талант";
  if (positive.has("leadership_potential") && positive.has("responsibility")) return "Скрытый лидер";
  if (negative.has("restart_loop") || trigger.has("lack_of_plan")) return "Человек отложенной жизни";
  if (negative.has("no_structure") && positive.has("creative_energy")) return "Бунтарь без системы";
  return "Человек отложенной жизни";
}

function inferMainStrength(tags: ReturnType<typeof deriveTags>, answers: AnswersMap) {
  if (tags.positiveTags.includes("responsibility")) return "Ты умеешь держать на себе больше, чем кажется со стороны.";
  if (tags.positiveTags.includes("analytical_strength")) return "Ты умеешь видеть структуру там, где другие видят только шум.";
  if (tags.positiveTags.includes("creative_energy")) return "У тебя есть живая энергия создавать, а не только потреблять.";
  if (tags.positiveTags.includes("learning_drive")) return "Ты умеешь быстро наращивать понимание и собирать новые опоры.";
  if (String(answers.discipline_area ?? "").trim()) return "У тебя уже есть опыт дисциплины, а значит, изменения не придётся начинать с нуля.";
  return "У тебя есть внутренняя способность замечать правду о себе, даже если она не всегда удобная.";
}

function inferMainRisk(tags: ReturnType<typeof deriveTags>) {
  if (tags.negativeTags.includes("avoidance_by_learning")) return "Жизнь может застрять в вечной подготовке без реального выхода в действие.";
  if (tags.negativeTags.includes("perfectionism")) return "Ты можешь путать высокую планку с невозможностью вообще начать.";
  if (tags.negativeTags.includes("overresponsibility")) return "Ты рискуешь постоянно тащить чужое и выгорать раньше, чем успеваешь жить свою жизнь.";
  if (tags.negativeTags.includes("comfort_trap")) return "Стабильность может постепенно превратиться в клетку, которую уже страшно трогать.";
  if (tags.negativeTags.includes("external_validation")) return "Чужая оценка может незаметно начать рулить твоими выборами сильнее, чем собственные желания.";
  if (tags.negativeTags.includes("scattered_focus")) return "Есть риск всё время менять направление и так и не собрать один устойчивый маршрут.";
  return "Главный риск в том, что ты будешь слишком долго жить в режиме ожидания и привыкнешь к нему как к норме.";
}

function inferPattern(answers: AnswersMap, tags: ReturnType<typeof deriveTags>, archetype: string) {
  const reward = getMulti(answers, "habit_reward");
  const trigger = getMulti(answers, "triggers");
  const pressure = getMulti(answers, "current_pressure");

  const triggerText = trigger[0] ?? pressure[0] ?? "сложная задача";
  const reaction =
    archetype === "Перфекционист в засаде"
      ? "Ты уходишь в доработку, анализ и подготовку, чтобы не показывать сырой результат."
      : archetype === "Умный прокрастинатор"
        ? "Ты уходишь в изучение, планирование или ещё одну идею вместо первого конкретного шага."
        : archetype === "Выгоревший тащер"
          ? "Ты хватаешь на себя слишком много, а потом отключаешься, когда ресурс заканчивается."
          : archetype === "Тихий заложник стабильности"
            ? "Ты остаёшься в понятной, но тесной траектории, потому что неизвестность кажется дороже, чем медленный застой."
            : "Ты выбираешь отсрочку, потому что она временно снижает внутреннее напряжение.";

  const temporaryReward =
    reward[0] === "Избегание стыда"
      ? "на время становится тише внутри и не нужно сталкиваться с оценкой"
      : reward[0] === "Ощущение контроля"
        ? "создаётся иллюзия, что ситуация ещё под контролем"
        : reward[0] === "Возможность не рисковать"
          ? "можно не проверять себя в реальности"
          : reward[0] === "Ощущение, что я “готовлюсь”"
            ? "есть чувство, что ты движешься, хотя движения почти нет"
            : "на время становится легче, потому что не нужно встречаться с неудобной правдой";

  const price =
    tags.negativeTags.includes("restart_loop")
      ? "Постепенно копится ощущение, что жизнь идёт циклами, а не вперёд."
      : tags.negativeTags.includes("comfort_trap")
        ? "Ты платишь временем, внутренней честностью и уважением к себе."
        : tags.negativeTags.includes("overresponsibility")
          ? "Ты платишь ресурсом, спокойствием и способностью вовремя остановиться."
          : "Ты платишь скоростью, уверенностью и шансом увидеть, на что ты реально способен.";

  const breaker =
    tags.negativeTags.includes("avoidance_by_learning")
      ? "Один маленький выход в действие до нового поиска информации."
      : tags.negativeTags.includes("perfectionism")
        ? "Показать черновой, неидеальный результат кому-то одному."
        : tags.negativeTags.includes("overresponsibility")
          ? "Снять с себя одну лишнюю обязанность и не заменять её новой."
          : tags.negativeTags.includes("comfort_trap")
            ? "Сделать неудобный, но честный шаг, который возвращает движение."
            : "Сделать первый практический шаг в ближайшие 24–72 часа, а не когда станет идеально.";

  return {
    trigger: triggerText,
    automatic_reaction: reaction,
    temporary_reward: temporaryReward,
    price,
    loop_breaker: breaker,
  };
}

function composeLetter(
  variant: "dark" | "strong",
  name: string,
  archetype: string,
  pattern: string,
  risk: string,
  strength: string,
  firstStep: string,
  price: string,
  goal: string,
) {
  if (variant === "dark") {
    const goalLine = goal ? `Да, и всё крутилось вокруг ${goal.toLowerCase()}.` : "Да, и всё крутилось вокруг одной и той же вещи, которую я долго не хотел называть вслух.";
    const closingLine = goal
      ? `И да, цель не умерла. Она просто слишком долго ждала, пока я перестану путать подготовку с жизнью.`
      : `И да, я не стал другим человеком за ночь. Просто наконец увидел, где именно себя терял.`;
    return [
      `Привет. Пишу тебе из той версии жизни, где всё вроде бы не развалилось, но и не стало по-настоящему моим.`,
      `Если честно, самое неприятное здесь не провал. Самое неприятное — привычка всё откладывать до момента, когда “станет понятнее”. Этот момент так и не приходит. А дни всё равно уходят. ${goalLine}`,
      `Я долго думал, что просто беру паузу, но на деле я прятался в подготовке. Там безопасно: можно быть умным, занятым, даже почти героическим — и при этом не показывать себя по-настоящему. ${pattern}`,
      `${risk} ${price} И в какой-то момент я заметил, что живу не жизнью, а черновиком жизни. В голове всё красиво, а в реальности одни недоделанные вещи и странная усталость от самого себя.`,
      `${closingLine} Один нормальный шаг тогда стоил бы дешевле, чем все эти годы внутреннего шума.`,
    ].join(" ");
  }

  return [
    `Привет. Это я из той версии, где всё наконец пошло не в голову, а в реальность.`,
    `Никакой магии не было. Я просто перестал делать вид, что подготовка уже считается движением, и сделал первый нормальный шаг: ${firstStep.toLowerCase()}. Смешно, но именно это и сдвинуло всё остальное.`,
    `Сначала страшно было почти так же. Потом оказалось, что страх не обязан исчезать, чтобы я начал. Я опёрся на свою ${strength.toLowerCase()} и перестал ждать идеального состояния. Это и сломало старую петлю.`,
    `${archetype.charAt(0).toUpperCase() + archetype.slice(1).toLowerCase()} больше не звучит как приговор. Это просто старая манера жить, которую я наконец начал перенастраивать. ${pattern}`,
    `${goal ? `Когда цель стала конкретной — ${goal.toLowerCase()} — у меня впервые появился маршрут, а не только желание. ` : ""}И вот что я понял: жизнь меняется не от больших обещаний. Она меняется, когда ты несколько раз подряд делаешь маленькое, но настоящее действие.`,
  ].join(" ");
}

function buildStoryCard(profileTitle: string, risk: string, step: string, dark: string, strong: string): StoryCard {
  return {
    title: profileTitle,
    if_nothing_changes: dark,
    if_i_start_now: strong,
    main_risk: risk,
    first_step: step,
  };
}

export function buildLocalResult(answers: AnswersMap): DivergenceResult {
  const tags = deriveTags(answers);
  const archetype = pickArchetype(answers, tags);
  const confidence = confidenceLevel(answers);
  const name = String(answers.name ?? "Ты").trim();
  const role = String(answers.current_role ?? "на развилке").trim();
  const age = String(answers.age ?? "").trim();
  const goal = String(answers.blocked_goal ?? "").trim();
  const firstStep = String(answers.first_72h_step ?? "сделать первый честный шаг").trim();
  const plan = String(answers.if_then_plan ?? "Если снова захочу отложить, то сделаю один шаг в течение 10 минут.").trim();
  const patternSummary = inferPattern(answers, tags, archetype);
  const strength = inferMainStrength(tags, answers);
  const risk = inferMainRisk(tags);

  const shortSummary = [
    `Похоже, ты сейчас живёшь в точке, где старый паттерн уже мешает, но ещё кажется безопасным.`,
    goal
      ? `Тебя тянет к ${goal.toLowerCase()}, но путь к этому цели постоянно сбивается о привычку откладывать, доучивать, доуточнять или ждать состояния “готов”.`
      : `Тебя тянет к цели, но путь к ней постоянно сбивается о привычку откладывать, доуточнять и ждать состояния “готов”.`,
    `Текущая траектория не выглядит катастрофой, но она постепенно сужает свободу, время и уважение к себе.`,
    `При этом у тебя уже есть опоры: ${strength.toLowerCase()}.`,
    `Именно поэтому развилка реальна: либо старый паттерн закрепится, либо один практический сдвиг запустит другую ветку.`,
  ].join(" ");

  const darkFutureLetter = composeLetter(
    "dark",
    name,
    archetype,
    patternSummary.automatic_reaction,
    risk,
    strength,
    firstStep,
    patternSummary.price,
    goal,
  );

  const strongFutureLetter = composeLetter(
    "strong",
    name,
    archetype,
    patternSummary.automatic_reaction,
    risk,
    strength,
    firstStep,
    patternSummary.price,
    goal,
  );

  const mainPattern = goal
    ? `Когда появляется важный шаг к цели “${goal}”, ты входишь в старую петлю: ${patternSummary.automatic_reaction.toLowerCase()}`
    : `Когда появляется важный шаг, ты входишь в старую петлю: ${patternSummary.automatic_reaction.toLowerCase()}`;

  return {
    profile_title: `Развилка: ${archetype}${name ? ` · ${name}` : ""}${age ? `, ${age}` : ""} ${role ? `· ${role}` : ""}`.trim(),
    archetype,
    confidence_level: confidence,
    short_summary: shortSummary,
    dark_future_letter: darkFutureLetter,
    strong_future_letter: strongFutureLetter,
    behavior_loop: patternSummary,
    main_pattern: mainPattern,
    main_risk: risk,
    main_strength: strength,
    first_72h_step: firstStep || "Сделать один шаг, который нельзя спутать с подготовкой.",
    if_then_plan: plan,
    story_card: buildStoryCard(
      `Моя развилка`,
      risk,
      firstStep || "Сделать один шаг, который нельзя спутать с подготовкой.",
      `Если ничего не изменить, ${risk.toLowerCase()}`,
      `Если начать сейчас, ${strength.toLowerCase()}.`,
    ),
    disclaimer:
      "Развилка не является психологическим диагнозом, медицинской рекомендацией или точным предсказанием будущего. Это AI-анализ твоих ответов, который помогает увидеть возможные поведенческие траектории и первый шаг к изменениям.",
  };
}

export function isHighRiskInput(answers: AnswersMap) {
  const text = extractText(answers);
  return containsAny(text, [
    "самопов",
    "суиц",
    "не хочу жить",
    "хочу умереть",
    "покончить с собой",
    "убить себя",
    "не вижу смысла жить",
    "навредить себе",
    "навредить другим",
    "убить",
  ]);
}

export function buildSafetyResult(answers: AnswersMap): DivergenceResult {
  const name = String(answers.name ?? "ты").trim();
  return {
    profile_title: `Развилка: сейчас тебе важнее поддержка, чем жёсткий разбор${name ? `, ${name}` : ""}`,
    archetype: "Точка поддержки",
    confidence_level: "low",
    short_summary:
      "По твоим ответам видно, что сейчас лучше не усиливать мрачные сценарии. Здесь важнее остановиться, дать себе поддержку и не оставаться с тяжёлыми мыслями одному. Развилка всё равно может быть полезной, но только как мягкое зеркало, а не как жёсткий анализ.",
    dark_future_letter:
      "Я не буду писать жёсткое письмо из мрачного будущего. Если внутри сейчас тяжело или опасно, важнее не прогноз, а поддержка живого человека рядом. Постарайся не оставаться с этим один, поговори с близким, специалистом или экстренной службой, если есть непосредственная опасность.",
    strong_future_letter:
      "Сейчас твой сильный шаг не в том, чтобы всё решить сразу, а в том, чтобы не оставаться одному с тяжёлыми мыслями. Даже короткий разговор, сообщение близкому или обращение за помощью уже меняет траекторию.",
    behavior_loop: {
      trigger: "Сильная перегрузка или тяжёлое состояние",
      automatic_reaction: "Уход в себя и попытка справиться одному",
      temporary_reward: "Короткое ощущение, что так безопаснее",
      price: "Можно остаться без поддержки в момент, когда она особенно нужна",
      loop_breaker: "Написать или позвонить живому человеку прямо сейчас",
    },
    main_pattern: "Сейчас важнее безопасность и поддержка, чем аналитический разбор петли.",
    main_risk: "Оставаться одному с тяжёлыми мыслями и перегрузкой.",
    main_strength: "Ты уже сделал важный шаг — не промолчал и вынес это наружу.",
    first_72h_step: "Поговорить с близким человеком или обратиться к специалисту/экстренной помощи, если есть риск для себя.",
    if_then_plan: "Если мне снова станет тяжело, то я не остаюсь один и сразу пишу или звоню человеку, которому доверяю.",
    story_card: {
      title: "Моя развилка",
      if_nothing_changes: "Сейчас важнее поддержка, чем жёсткий анализ.",
      if_i_start_now: "Если начать сейчас, первый шаг — не оставаться одному.",
      main_risk: "Оставаться один на один с тяжёлыми мыслями",
      first_step: "Написать или позвонить живому человеку",
    },
    disclaimer:
      "Развилка не является психологическим диагнозом, медицинской рекомендацией или точным предсказанием будущего. Если тебе сейчас небезопасно, пожалуйста, обратись к близкому человеку, специалисту или в экстренную службу.",
  };
}

export function stripHtml(text: string) {
  return text.replace(/[<>]/g, "");
}
