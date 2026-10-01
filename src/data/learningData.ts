export interface LearnArticle {
  id: string;
  category: 'quran' | 'hadith' | 'manners' | 'fiqh' | 'prophetic';
  title: string;
  arabic?: string;
  english: string;
  commentary: string;
  reference: string;
  typeBadge: 'Quran' | 'Hadith' | 'Fiqh' | 'Seerah';
}

export const LEARNING_ITEMS: LearnArticle[] = [
  {
    id: 'l1',
    category: 'quran',
    typeBadge: 'Quran',
    title: 'Peace of the Heart through Dhikr',
    arabic: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    english: '“Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.”',
    commentary: 'True tranquility in marriage, personal struggle, and daily life is not found in material circumstance, but in steady connection to Allah.',
    reference: 'Surah Ar-Ra’d (13:28)',
  },
  {
    id: 'l2',
    category: 'hadith',
    typeBadge: 'Hadith',
    title: 'The Most Beloved Deeds to Allah',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ تَعَالَى أَدْوَمُهَا وَإِنْ قَلَّ',
    english: 'The Prophet ﷺ said: “The most beloved deeds to Allah are those that are consistent, even if they are small.”',
    commentary: 'Building a consistent habit of five prayers and even 2 pages of Quran daily brings greater barakah than sporadic bursts followed by abandonment.',
    reference: 'Sahih al-Bukhari 6464, Sahih Muslim 782',
  },
  {
    id: 'l3',
    category: 'hadith',
    typeBadge: 'Hadith',
    title: 'The Prayer in its Early Time',
    arabic: 'سَأَلْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: أَيُّ الْعَمَلِ أَحَبُّ إِلَى اللَّهِ؟ قَالَ: «الصَّلَاةُ عَلَى وَقْتِهَا»',
    english: 'Ibn Mas’ud reported: I asked the Messenger of Allah ﷺ: “Which deed is dearest to Allah?” He replied: “Prayer offered at its proper appointed time.”',
    commentary: 'Praying as soon as the Adhan is called reflects prioritization of Allah over our worldly distractions.',
    reference: 'Sahih al-Bukhari 527, Sahih Muslim 85',
  },
  {
    id: 'l4',
    category: 'manners',
    typeBadge: 'Seerah',
    title: 'Gentleness Between Companions & Spouses',
    arabic: 'إِنَّ الرِّفْقَ لَا يَكُونُ فِي شَيْءٍ إِلَّا زَانَهُ، وَلَا يُنْزَعُ مِنْ شَيْءٍ إِلَّا شَانَهُ',
    english: 'The Prophet ﷺ said: “Verily, gentleness is not found in anything except that it beautifies it, and it is not removed from anything except that it disgraces it.”',
    commentary: 'In your shared journey, remind each other gently. Never use prayer or ibadah to criticize, boast, or demean.',
    reference: 'Sahih Muslim 2594',
  },
  {
    id: 'l5',
    category: 'fiqh',
    typeBadge: 'Fiqh',
    title: 'The Valid Time Windows for the Five Prayers',
    english: '• Fajr begins at true dawn (Subh Sadiq) and ends at sunrise.\n• Dhuhr begins after the sun passes its zenith (Zawal) and lasts until the shadow of an object equals its length.\n• Asr begins when Dhuhr ends and lasts until sunset (preferred before the sun yellows).\n• Maghrib begins immediately after sunset and lasts until twilight disappears.\n• Isha begins after twilight disappears and lasts until Islamic midnight (middle of the night between sunset and dawn), though valid until dawn.',
    commentary: 'Scholarly consensus across the four Sunni madhhabs (Hanafi, Maliki, Shafi’i, Hanbali) affirms these primary boundaries with minor juristic timing variations for Asr shadow calculations.',
    reference: 'Fiqh us-Sunnah (Sayyid Sabiq), Al-Fiqh al-Islami wa Adillatuh (Wahbah al-Zuhayli)',
  },
  {
    id: 'l6',
    category: 'hadith',
    typeBadge: 'Hadith',
    title: 'Reciting Quran with Ease and Difficulty',
    arabic: 'الَّذِي يَقْرَأُ القُرْآنَ وَهُوَ مَاهِرٌ بِهِ مَعَ السَّفَرَةِ الكِرَامِ البَرَرَةِ، وَالَّذِي يَقْرَأُ القُرْآنَ وَيَتَتَعْتَعُ فِيهِ وَهُوَ عَلَيْهِ شَاقٌّ لَهُ أَجْرَانِ',
    english: 'The Prophet ﷺ said: “The one who recites the Quran proficiently will be with the noble righteous scribes (angels), and the one who recites with stammering and difficulty will have double reward.”',
    commentary: 'Never feel discouraged if reading Arabic takes time. The effort itself is honored with extra reward from Allah.',
    reference: 'Sahih al-Bukhari 4937, Sahih Muslim 798',
  }
];
