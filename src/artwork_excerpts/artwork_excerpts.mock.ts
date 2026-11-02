import type { ArtworkExcerpt } from './artwork_excerpt';

// В ЛР5 все карточки берутся из этой коллекции. Обращений к API нет.
// Даты и числа цитирований — учебные данные, унаследованные от ЛР2.
export const ARTWORK_EXCERPTS_MOCK: readonly ArtworkExcerpt[] = [
  { id: 1, artworkTitle: 'Преступление и наказание',
    shortDescription: 'История нравственного выбора Раскольникова и последствий идеи о праве сильного человека переступить закон. Роман Фёдора Достоевского о совести и ответственности.',
    imageUrl: '/media/crime-and-punishment.jpg', videoUrl: '/media/crime-and-punishment.mp4',
    artworkCreationDate: '1866-01-01', citationCount: 12840, likeCount: 5 },
  { id: 2, artworkTitle: 'Война и мир',
    shortDescription: 'Роман Льва Толстого соединяет судьбы нескольких семей с событиями Отечественной войны и размышлениями о ходе истории.',
    imageUrl: '/media/war-and-peace.jpg', videoUrl: '/media/war-and-peace.mp4',
    artworkCreationDate: '1869-01-01', citationCount: 15320, likeCount: 7 },
  { id: 3, artworkTitle: 'Гамлет',
    shortDescription: 'Трагедия Уильяма Шекспира о датском принце, который пытается открыть правду о смерти отца и определить границы личного долга.',
    imageUrl: '', videoUrl: '/media/hamlet.mp4',
    artworkCreationDate: '1601-01-01', citationCount: 21950, likeCount: 8 },
  { id: 4, artworkTitle: 'Алиса в Стране чудес',
    shortDescription: 'Путешествие Алисы по фантастическому миру стало источником образов для литературы, театра и кинематографа. Автор — Льюис Кэрролл.',
    imageUrl: '/media/alice-in-wonderland.jpg', videoUrl: '/media/alice-in-wonderland.mp4',
    artworkCreationDate: '1865-11-26', citationCount: 9840, likeCount: 6 },
  { id: 5, artworkTitle: 'Божественная комедия',
    shortDescription: 'Поэтическое путешествие Данте через загробный мир сформировало множество устойчивых образов европейской культуры.',
    imageUrl: '/media/divine-comedy.jpg', videoUrl: '/media/divine-comedy.mp4',
    artworkCreationDate: '1321-01-01', citationCount: 17610, likeCount: 4 },
  { id: 6, artworkTitle: 'Дон Кихот',
    shortDescription: 'История странствующего рыцаря исследует столкновение идеала с реальностью и влияние литературы на человека. Автор — Мигель де Сервантес.',
    imageUrl: null, videoUrl: '',
    artworkCreationDate: '1605-01-16', citationCount: 14270, likeCount: 3 },
];
