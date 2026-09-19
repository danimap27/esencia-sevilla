export interface BlogPost {
  slug: string;
  titleKey: string;
  excerptKey: string;
  coverImage: string;
  category: string;
  minRead: number;
  publishedAt: string;
  content: {
    es: string;
    en: string;
    fr: string;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'que-ver-en-sevilla-en-3-dias',
    titleKey: 'posts.3days.title',
    excerptKey: 'posts.3days.excerpt',
    coverImage: 'https://images.unsplash.com/photo-1559682468-8c0a40392e94?w=1200',
    category: 'Guias',
    minRead: 8,
    publishedAt: '2024-09-15',
    content: {
      es: `# Qué ver en Sevilla en 3 días

Sevilla es una ciudad que se vive, no solo se visita. Tres días son suficientes para descubrir lo esencial, pero te dejarán con ganas de más.

## Día 1: El centro histórico

**Mañana:** Comienza por la **Catedral de Sevilla** y la **Giralda**. Sube los 34 rampas (sin escaleras) de la torre para una vista panorámica de la ciudad. La Catedral es la más grande del mundo por superficie y alberga la tumba de Cristóbal Colón.

**Tarde:** Justo al lado, el **Real Alcázar** te espera. Este palacio mudéjar es uno de los mejor conservados del mundo. Reserva al menos 2 horas. El patio de las Doncellas y los jardines son planesa obligados.

**Noche:** Pasea por el **Barrio de Santa Cruz**. Sus callejuelas estrechas, plazas escondidas y naranjos te transportan a otra época. Cena en una taberna local y prueba el salmorejo y el pescaíto frito.

## Día 2: Triana y el río

**Mañana:** Cruza el puente de Isabel II hacia **Triana**. Este barrio fue el hogar de alfareros, toreros y bailaores de flamenco. Visita el Castillo de San Jorge (sede de la Inquisición) y la calle Alfarería.

**Tarde:** Camina junto al **río Guadalquivir** hasta la **Torre del Oro**. Sube a su mirador para una vista de la ciudad desde el río. Después, visita la **Plaza de Toros** de la Real Maestranza.

**Noche:** Asiste a un espectáculo de **flamenco** en Triana. Es el barrio donde nació este arte. Recomendamos la Casa de la Memoria o el Museo del Baile Flamenco.

## Día 3: Plaza de España y Sevilla moderna

**Mañana:** La **Plaza de España** te espera en el Parque de María Luisa. Construida para la Exposición Iberoamericana de 1929, es uno de los espacios más impresionantes de España. No te pierdas los bancos de azulejos de cada provincia.

**Tarde:** Visita el **Parque de María Luisa** y el **Archivo de Indias** (patrimonio UNESCO). Después, si tienes tiempo, el **Metropol Parasol** (Las Setas) ofrece vistas 360° de la ciudad desde 30 metros de altura.

**Noche:** Termina tu visita en la **Alameda de Hércules**, la zona más animada de Sevilla. Bares, terrazas y ambiente joven.

## Consejos prácticos

- **Calzado**: Lleva zapatos cómodos. Sevilla se camina mucho.
- **Horario**: En verano, evita las horas centrales del día (13:00-18:00). Aprovecha la mañana temprano y la tarde-noche.
- **Tapas**: Pide 2-3 tapas por persona en cada barra. Lo normal es ir de tapeo y cambiar de sitio.
- **Transporte**: El centro es completamente caminable. Usa el autobús para llegar a lugares lejanos.`,
      en: `# What to see in Seville in 3 days

Seville is a city to be lived, not just visited. Three days are enough to discover the essentials, but they will leave you wanting more.

## Day 1: The historic centre

**Morning:** Start with the **Seville Cathedral** and the **Giralda**. Climb the 34 ramps (no stairs) of the tower for a panoramic view. The Cathedral is the largest in the world by area and houses Columbus's tomb.

**Afternoon:** Right next door, the **Royal Alcázar** awaits. This Mudéjar palace is one of the best preserved in the world. Allow at least 2 hours. The Courtyard of the Maidens and the gardens are must-sees.

**Night:** Walk through the **Santa Cruz Quarter**. Its narrow streets, hidden squares, and orange trees transport you to another era. Dine at a local tavern and try salmorejo and fried fish.

## Day 2: Triana and the river

**Morning:** Cross the Isabel II bridge to **Triana**. This neighborhood was home to potters, bullfighters, and flamenco dancers. Visit the Castle of San Jorge and Calle Alfarería.

**Afternoon:** Walk along the **Guadalquivir River** to the **Torre del Oro**. Then visit the **Plaza de Toros** of the Real Maestranza.

**Night:** Attend a **flamenco** show in Triana. It's the neighborhood where this art was born.

## Day 3: Plaza de España and modern Seville

**Morning:** The **Plaza de España** awaits in María Luisa Park. Built for the 1929 Ibero-American Exposition, it's one of the most impressive spaces in Spain.

**Afternoon:** Visit **María Luisa Park** and the **Archive of the Indies** (UNESCO heritage). Then, if time permits, **Metropol Parasol** offers 360° views.

## Practical tips

- **Footwear**: Wear comfortable shoes. Seville requires a lot of walking.
- **Schedule**: In summer, avoid midday hours (1-6pm). Use early mornings and evenings.
- **Tapas**: Order 2-3 tapas per person at each bar. It's normal to go bar-hopping.
- **Transport**: The center is completely walkable. Use the bus for remote places.`,
      fr: `# Que voir à Séville en 3 jours

Séville est une ville qui se vit, pas seulement qui se visite. Trois jours suffisent pour découvrir l'essentiel.

## Jour 1 : Le centre historique

**Matin :** Commencez par la **Cathédrale de Séville** et la **Giralda**. Montez les 34 rampes pour une vue panoramique.

**Après-midi :** Juste à côté, l'**Alcázar Royal** vous attend. Ce palais mudéjar est l'un des mieux conservés au monde.

**Soir :** Promenez-vous dans le **quartier de Santa Cruz**. Ses ruelles étroites et ses orangers vous transportent.

## Jour 2 : Triana et le fleuve

**Matin :** Traversez le pont Isabel II vers **Triana**. Ce quartier était celui des potiers et des danseurs de flamenco.

**Après-midi :** Marchez le long du **Guadalquivir** jusqu'à la **Torre del Oro**.

**Soir :** Assistez à un spectacle de **flamenco** à Triana.

## Jour 3 : Plaza de España

**Matin :** La **Plaza de España** vous attend dans le parc María Luisa. L'un des espaces les plus impressionnants d'Espagne.

## Conseils pratiques

- **Chaussures** : Portez des chaussures confortables.
- **Horaires** : En été, évitez les heures centrales.
- **Tapas** : Commandez 2-3 tapas par personne à chaque bar.`,
    },
  },
  {
    slug: 'sevilla-con-ninos-guia-completa',
    titleKey: 'posts.kids.title',
    excerptKey: 'posts.kids.excerpt',
    coverImage: 'https://images.unsplash.com/photo-1602215154297-7a9d3e8e2e1a?w=1200',
    category: 'Familias',
    minRead: 7,
    publishedAt: '2024-10-01',
    content: {
      es: `# Sevilla con niños: guía completa

Sevilla es una ciudad sorprendentemente buena para visitar con niños. Hay parques, museos interactivos y mucho espacio al aire libre.

## Parques y espacios al aire libre

**Parque de María Luisa**: El parque más emblemático de Sevilla. Los niños pueden correr libremente entre los jardines, fuentes y plazas. La Plaza de España está dentro del parque y a los niños les fascina.

**Parque del Alamillo**: En la Isla de la Cartuja, es el parque más grande de Sevilla. Tiene áreas de juegos, ciclovías y mucho espacio verde.

**Jardines de Murillo**: Junto al Barrio de Santa Cruz, son jardines tranquilos con sombra y bancos, ideales para un descanso.

## Museos para niños

**Casa de la Ciencia**: Museo interactivo con acuario y planetario. Los niños aman las exhibiciones táctiles.

**Acuario de Sevilla**: En el Parque de María Luisa, tiene más de 3,000 animales marinos.

**Museo del Baile Flamenco**: Aunque pueda no parecerlo, a los niños les fascina el flamenco. Las exhibiciones son visuales y dinámicas.

## Actividades divertidas

1. **Paseo en barco por el Guadalquivir**: Cruceros turísticos de 1 hora que salen desde la Torre del Oro.
2. **Metropol Parasol (Las Setas)**: Subir al mirador es como estar en una nave espacial.
3. **Cabearios del Guadalquivir**: Véis los caeballos en el río durante los paseos.
4. **Plaza de España**: Alquilar un barquito para remar en el canal.

## Dónde comer con niños

- **Horno San Buenaventura**: Tapas para toda la familia, ambiente relajado.
- **100 Montaditos**: A los niños les encantan los mini bocadillos.
- **Mercado de Feria**: Comida fresca y ambiente auténtico.

## Consejos

- Lleva siempre agua y protección solar en verano.
- El horario español (comida 14:00, cena 21:00) puede ser tardío para los niños. Adapta los horarios.
- Sevilla es muy caminable, pero con niños considera el autobús para distancias largas.`,
      en: `# Seville with kids: complete guide

Seville is surprisingly good for visiting with children. There are parks, interactive museums, and lots of outdoor space.

## Parks and outdoor spaces

**María Luisa Park**: The most iconic park. Kids can run freely among gardens, fountains, and squares.

**Alamillo Park**: The largest park in Seville with playgrounds and bike paths.

## Museums for kids

**Casa de la Ciencia**: Interactive museum with aquarium and planetarium.

**Seville Aquarium**: Over 3,000 marine animals in María Luisa Park.

## Fun activities

1. **Boat ride on the Guadalquivir**: 1-hour cruises from Torre del Oro.
2. **Metropol Parasol**: Going up to the viewpoint is like being in a spaceship.
3. **Plaza de España**: Rent a small boat to row in the canal.

## Where to eat with kids

- **100 Montaditos**: Kids love the mini sandwiches.
- **Horno San Buenaventura**: Family-friendly tapas.

## Tips

- Always carry water and sun protection in summer.
- Spanish meal times (lunch 2pm, dinner 9pm) may be late for kids. Adjust schedules.
- Seville is very walkable, but consider the bus for long distances with kids.`,
      fr: `# Séville avec enfants : guide complet

Séville est étonnamment bonne à visiter avec des enfants. Il y a des parcs, des musées interactifs et beaucoup d'espaces en plein air.

## Parcs et espaces extérieurs

**Parc María Luisa** : Le parc le plus emblématique. Les enfants peuvent courir librement.

## Musées pour enfants

**Casa de la Ciencia** : Musée interactif avec aquarium et planétarium.

## Activités amusantes

1. **Promenade en bateau sur le Guadalquivir** : Croisières d'1 heure.
2. **Metropol Parasol** : Monter au mirador comme dans un vaisseau spatial.

## Conseils

- Portez toujours de l'eau et une protection solaire en été.
- Les horaires espagnols peuvent être tardifs pour les enfants.`,
    },
  },
  {
    slug: 'semana-santa-en-sevilla-consejos',
    titleKey: 'posts.semanaSanta.title',
    excerptKey: 'posts.semanaSanta.excerpt',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200',
    category: 'Festivales',
    minRead: 6,
    publishedAt: '2024-10-15',
    content: {
      es: `# Semana Santa en Sevilla: consejos para turistas

La Semana Santa en Sevilla es una de las celebraciones más impresionantes del mundo. Más de 60 hermandades procesionan por las calles durante 7 días.

## Lo esencial

La Semana Santa sevillana es una experiencia cultural y religiosa única. Las procesiones (estaciones de penitencia) recorren la ciudad desde sus iglesias hasta la Catedral.

## Dónde ver las procesiones

**Carrera Oficial**: El recorrido obligatorio por donde pasan todas las hermandades. Las mejores zonas:
- **Campana**: Salida de las hermandades. Ambiente íntimo.
- **Calle Sierpes**: El centro neurálgico. Llega temprano para conseguir sitio.
- **Plaza de San Francisco**: Frente al Ayuntamiento. Vista excelente de los pasos.

## Horario y planificación

- **Domingo de Ramos**: El día más familiar. La Victoria sale temprano.
- **Jueves Santo**: Las hermandades más populares (Los Negritos, El Gran Poder).
- **Madrugada del Viernes Santo**: La noche más esperada. Las hermandades salen de madrugada.
- **Viernes Santo**: El Santo Entierro cierra la Semana Santa.

## Consejos prácticos

1. **Reserva con antelación**: Es la época más solicitada. Reserva alojamiento y restaurantes con meses de antelación.
2. **Calzado cómodo**: Pasarás muchas horas de pie.
3. **Ropa de abrigo en la madrugada**: En la madrugada del Viernes hace frío.
4. **Mapa de carreras**: Descarga la app "SVQ Semana Santa" para seguir las procesiones en tiempo real.
5. **Respeta el silencio**: Durante el paso de las hermandades, se guarda silencio. No es un espectáculo turístico, es una tradición religiosa.

## Gastronomía de Semana Santa

- **Torrijas**: Dulce típico de Semana Santa.
- **Pinchos moruños**: No confundir con los de feria.
- **Platos de vigilia**: Bacalao, espinacas con garbanzos.`,
      en: `# Holy Week in Seville: tips for tourists

Holy Week in Seville is one of the most impressive celebrations in the world. More than 60 brotherhoods process through the streets over 7 days.

## The essentials

Seville's Holy Week is a unique cultural and religious experience. The processions (stations of penance) traverse the city from their churches to the Cathedral.

## Where to see the processions

**Official Route**: The mandatory path where all brotherhoods pass. Best spots:
- **Campana**: Brotherhoods' exit. Intimate atmosphere.
- **Sierpes Street**: The nerve center. Arrive early.
- **San Francisco Square**: Excellent view of the floats.

## Tips

1. **Book in advance**: Most popular time. Book accommodation and restaurants months ahead.
2. **Comfortable shoes**: You'll stand for many hours.
3. **Warm clothes for the early morning**: It's cold during Friday's dawn procession.
4. **Respect the silence**: During the passage, silence is maintained. It's a religious tradition, not a tourist spectacle.

## Holy Week gastronomy

- **Torrijas**: Typical Holy Week sweet.
- **Vigil dishes**: Codfish, spinach with chickpeas.`,
      fr: `# Semaine Sainte à Séville : conseils pour touristes

La Semaine Sainte à Séville est l'une des célébrations les plus impressionnantes au monde. Plus de 60 confréries défilent pendant 7 jours.

## L'essentiel

La Semaine Sainte sévillane est une expérience culturelle et religieuse unique.

## Où voir les processions

**Parcours officiel** : Le chemin obligatoire. Meilleurs endroits :
- **Campana** : Sortie des confréries.
- **Rue Sierpes** : Le centre névralgique.

## Conseils

1. **Réservez à l'avance** : Période la plus demandée.
2. **Chaussures confortables** : Vous resterez debout longtemps.
3. **Respectez le silence** : C'est une tradition religieuse.`,
    },
  },
  {
    slug: 'como-moverse-por-sevilla-en-autobus',
    titleKey: 'posts.bus.title',
    excerptKey: 'posts.bus.excerpt',
    coverImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7f?w=1200',
    category: 'Transporte',
    minRead: 5,
    publishedAt: '2024-11-01',
    content: {
      es: `# Cómo moverse por Sevilla en autobús

El autobús es la forma más práctica y económica de moverse por Sevilla. La red TUSSAM cubre toda la ciudad.

## La tarjeta Multiviaje

La **Tarjeta Multiviaje** es esencial para usar el autobús. Se compra en estancos y puntos de recarga.

- **Coste**: 1.50€ (compra de la tarjeta)
- **Recarga mínima**: 5€
- **Precio por viaje**: 0.70€ con tarjeta vs 1.40€ sin tarjeta
- **Transbordo**: 0.35€ si haces transbordo dentro de 1 hora

## Líneas principales

- **EA**: Aeropuerto - Centro (exprés, 4€). La línea más útil para turistas que llegan al aeropuerto.
- **21**: Plaza Nueva - Santa Justa. Conecta el centro con la estación de tren.
- **C1/C2**: Circulares. Recorren el centro en circuito cerrado.
- **40**: Plaza Nueva - Plaza de España. Para llegar al Parque María Luisa.

## App y horarios

Descarga la app **TUSSAM** para consultar horarios en tiempo real y paradas cercanas.

## Consejos

1. **Valida siempre**: Al subir, pasa la tarjeta por el validador.
2. **Puerta delantera**: Siempre se sube por delante, se baja por atrás.
3. **Horario nocturno**: Hay líneas nocturnas (N1-N7) desde la medianoche.
4. **Bicicletas**: 2 autobuses llevan bicis en el maletero (pregunta al conductor).

## Otras opciones

- **Metro**: Línea 1 (Santa Justa - Olivar de Quinto). Útil para la periferia.
- **Tranvía**: Línea T1 (Plaza Nueva - San Bernardo).
- **Patinetes eléctricos**: Voi y Lime disponibles por toda la ciudad.`,
      en: `# How to get around Seville by bus

The bus is the most practical and economical way to get around Seville. The TUSSAM network covers the entire city.

## The Multiviaje card

The **Multiviaje Card** is essential for using the bus. Buy at newsstands and reload points.

- **Cost**: €1.50 (card purchase)
- **Minimum reload**: €5
- **Price per ride**: €0.70 with card vs €1.40 without
- **Transfer**: €0.35 if you transfer within 1 hour

## Main lines

- **EA**: Airport - Center (express, €4). Most useful for tourists arriving at the airport.
- **21**: Plaza Nueva - Santa Justa. Connects center with train station.
- **C1/C2**: Circular routes through the center.
- **40**: Plaza Nueva - Plaza de España.

## Tips

1. **Always validate**: Pass the card on the validator when boarding.
2. **Front door**: Board at the front, exit at the back.
3. **Night service**: Night lines (N1-N7) from midnight.
4. **App**: Download **TUSSAM** app for real-time schedules.`,
      fr: `# Comment se déplacer à Séville en bus

Le bus est le moyen le plus pratique et économique pour se déplacer à Séville. Le réseau TUSSAM couvre toute la ville.

## La carte Multiviaje

La **carte Multiviaje** est essentielle. Achetez-la dans les bureaux de tabac.

- **Coût** : 1,50€ (achat de la carte)
- **Prix par trajet** : 0,70€ avec carte vs 1,40€ sans

## Lignes principales

- **EA** : Aéroport - Centre (express, 4€).
- **21** : Plaza Nueva - Santa Justa.

## Conseils

1. **Validez toujours** votre carte.
2. **Porte avant** : Montée à l'avant, descente à l'arrière.
3. **App TUSSAM** pour les horaires en temps réel.`,
    },
  },
  {
    slug: 'mejores-tapas-cerca-de-la-catedral',
    titleKey: 'posts.tapas.title',
    excerptKey: 'posts.tapas.excerpt',
    coverImage: 'https://images.unsplash.com/photo-1467003909665-2b7b5768e2e1?w=1200',
    category: 'Gastronomia',
    minRead: 6,
    publishedAt: '2024-11-15',
    content: {
      es: `# Las mejores tapas cerca de la Catedral

La zona alrededor de la Catedral de Sevilla es uno de los mejores lugares para ir de tapeo. Aquí están nuestras recomendaciones personales.

## Tapas imprescindibles

1. **Salmorejo**: Crema fría de tomate y pan. El mejor de Sevilla está en Casa Morales.
2. **Pescaíto frito**: Variedad de pescado frito. Punto clave de la gastronomía sevillana.
3. **Espinacas con garbanzos**: Plato tradicional andaluz.
4. **Flamenquín**: Jamón serrano envuelto en cerdo rebozado.
5. **Carrillada de ibérico**: Carrillada de cerdo ibérico en salsa.

## Nuestros sitios favoritos

### Casa Morales (1836)
- **Especialidad**: Tapas tradicionales, vino de la casa
- **Precio**: €€ (moderado)
- **Distancia de la Catedral**: 5 min andando
- **Ambiente**: Tablao de barrio, auténtico
- **Recomendación**: Ve temprano, se llena rápido

### Bodeguita Antonio Romero
- **Especialidad**: Montaditos y carrillada
- **Precio**: €€
- **Distancia**: 4 min andando
- **Ambiente**: Familiar, animado
- **Recomendación**: Prueba el salmorejo y el flamenquín

### El Rinconcillo
- **Especialidad**: Tapas tradicionales desde 1670
- **Precio**: €€
- **Distancia**: 7 min andando
- **Ambiente**: El bar más antiguo de Sevilla
- **Recomendación**: Cuenta con tiza en la barra, como en los viejos tiempos

### Las Columnas
- **Especialidad**: Tapas variadas, grandes raciones
- **Precio**: € (económico)
- **Distancia**: 3 min andando
- **Ambiente**: Terraza en plaza, muy animado
- **Recomendación**: Ideal para grupos, grandes raciones

## El arte del tapeo

El tapeo en Sevilla no es solo comer. Es:
- **Social**: Se comparte, se conversa
- **Nómada**: Se va de bar en bar
- **Fresco**: Cada tapa es 1-2 bocados
- **Temprano empejar**: A partir de las 13:00 (comida) y 20:30 (cena)

## Consejos

- **Pide 2-3 tapas por persona** en cada barra
- **Cambia de barra** después de 2-3 tapas
- **Pregunta por la especialidad de la casa**
- **Evita las traps para turistas**: Busca sitios donde comen los locales`,
      en: `# The best tapas near the Cathedral

The area around Seville Cathedral is one of the best places for tapas. Here are our personal recommendations.

## Must-try tapas

1. **Salmorejo**: Cold tomato and bread cream.
2. **Pescaíto frito**: Fried fish variety. Key dish of Sevillian cuisine.
3. **Spinach with chickpeas**: Traditional Andalusian dish.
4. **Flamenquín**: Serrano ham wrapped in breaded pork.
5. **Pork cheek**: Iberian pork cheek in sauce.

## Our favorite spots

### Casa Morales (1836)
- **Specialty**: Salmorejo, aged cheese
- **Price**: €€
- **Distance from Cathedral**: 5 min walk
- **Recommendation**: Go early, it fills up fast

### Bodeguita Antonio Romero
- **Specialty**: Classic tapas, fried fish
- **Price**: €€
- **Distance**: 2 min from Cathedral
- **Recommendation**: Try salmorejo and flamenquín

### El Rinconcillo
- **Specialty**: Traditional tapas since 1670
- **Price**: €€
- **Distance**: 7 min walk
- **Recommendation**: The oldest bar in Seville

## The art of tapas

Tapas in Seville is not just eating. It's:
- **Social**: Shared, conversational
- **Nomadic**: Go from bar to bar
- **Fresh**: Each tapa is 1-2 bites

## Tips

- **Order 2-3 tapas per person** at each bar
- **Change bars** after 2-3 tapas
- **Ask for the house specialty**`,
      fr: `# Les meilleures tapas près de la Cathédrale

Le quartier autour de la Cathédrale de Séville est l'un des meilleurs endroits pour les tapas.

## Tapas incontournables

1. **Salmorejo** : Crème froide de tomate et pain.
2. **Pescaíto frito** : Poisson frit varié.
3. **Épinards aux pois chiches** : Plat andalou traditionnel.

## Nos adresses favorites

### Casa Morales (1836)
- **Spécialité** : Salmorejo, fromage affiné
- **Prix** : €€
- **Distance** : 5 min à pied

### Bodeguita Antonio Romero
- **Spécialité** : Tapas classiques
- **Prix** : €€
- **Distance** : 2 min de la Cathédrale

## L'art des tapas

- **Social** : On partage, on discute
- **Nomade** : On va de bar en bar
- **Commandez 2-3 tapas par personne**`,
    },
  },
];