/*
 * Environments: the settings a story can take place in. Each gathers what belongs to it — the things of the
 * library, the beings one meets there, and the rooms it can be built from.
 *
 *   cats     library categories that belong here whole (ids as in public/px/index.json)
 *   pick     { category: /words/ }  only the things of that category whose name matches
 *   beings   the same for characters: { category: true | /words/ }
 *   rooms    room themes (public/shared/rooms.js) in this setting
 *
 * A thing may show up in more than one environment. What fits none is found under Objects; people, animals and
 * creatures are all under Beings.
 */
export const ENVIRONMENTS = [
  {
    id: 'victorian',
    name: 'Victorian',
    cats: ['env-victorian', 'furniture', 'doors'],
    beings: { townsfolk: /noble|maid|butler|priest|elder|granny/, apparitions: /butler|caretaker|twins|ghost-lady|ghost-bride/ },
    rooms: ['victorian', 'oldhouse', 'parlour', 'hall', 'rosepaper', 'stripepaper', 'damask', 'panel', 'library', 'study', 'hotel', 'theatre'],
  },
  {
    id: 'modernhome',
    name: 'Modern home',
    cats: ['env-modernhome', 'home'],
    beings: { people: /mum|dad|man$|woman$|teen|kid|grand|baby/ },
    rooms: ['modern', 'kitchen', 'crackplaster'],
  },
  {
    id: 'apartment',
    name: 'Apartment complex',
    cats: ['env-apartment'],
    pick: { home: /sofa|tv|fridge|door|bin|box|washing/ },
    beings: { people: /cleaner|mail|courier|police|old|punk|teen/ },
    rooms: ['apartment', 'crackplaster'],
  },
  {
    id: 'childroom',
    name: 'Child’s room',
    cats: ['env-childroom'],
    pick: { attic: /doll|teddy|toy|crib|cradle|rocking-horse|music|pram|marionette|jack|blocks|train|soldier|spinning/, home: /crib|bunk/ },
    beings: { people: /kid|baby|birthday|school/, cast: /kid/, apparitions: /child|doll|twins/ },
    rooms: ['childroom', 'nursery'],
  },
  { id: 'attic', name: 'Attic', cats: ['env-attic', 'attic'], beings: { apparitions: /ghost|moth|bat|rat|doll|mannequin/ }, rooms: ['attic'] },
  {
    id: 'basement',
    name: 'Basement',
    cats: ['env-basement'],
    pick: {
      household:
        /boiler|furnace|coal|generator|pipes|fuse|barrel|wine|cage|chains|drain|drum|pallet|sump|shelf|workbench|tool|pump|mangle|tub|preserve|bottle/,
    },
    beings: { apparitions: /rat|spider|ghoul|hands|eyes|sack/ },
    rooms: ['basement', 'cellar', 'winecellar', 'scullery', 'sewer'],
  },
  {
    id: 'toilet',
    name: 'Toilet',
    cats: ['env-toilet'],
    pick: { household: /toilet|bath|basin|mirror|towel|bucket|sink/, home: /bath|shower|toilet|sink|soap|towel|tooth|shampoo|duck|hairdryer|comb/ },
    rooms: ['toilet', 'bathroom'],
  },
  {
    id: 'cottage',
    name: 'Cottage',
    cats: ['env-cottage'],
    pick: {
      household: /stove|oven|sink-stone|hanging|jar|pantry|butcher|kettle|bread|flour|milk|churn|scales|dresser|water-pump|coal/,
      props: /table|chair|stool|bed|barrel|bucket|pot|sack|cupboard/,
    },
    beings: { townsfolk: /farmer|villager|shepherd|granny|elder|boy|girl|miner|lumber|fisher/ },
    rooms: ['cottage', 'cabin', 'barn'],
  },
  {
    id: 'garden',
    name: 'Garden',
    cats: ['env-garden', 'yard', 'nature'],
    pick: { home: /lawn|watering|hose|flower|wheelbarrow|gnome|bird|barbecue|deck|parasol|pool|swing|slide|dog|hammock|washing-line/ },
    beings: { people: /gardener/, apparitions: /crow|cat|dog|scarecrow/ },
    rooms: ['gardenwall', 'garden', 'greenhouse', 'cornfield'],
  },
  {
    id: 'school',
    name: 'School',
    cats: ['env-school'],
    beings: { people: /teacher|pupil|school|student|professor|coach|cleaner|librarian/ },
    rooms: ['school', 'library'],
  },
  {
    id: 'hospital',
    name: 'Hospital',
    cats: ['env-hospital', 'madscience'],
    beings: { people: /doctor|nurse|surgeon|paramedic/, apparitions: /nurse|plague|faceless/ },
    rooms: ['hospital', 'asylum', 'morgue', 'lab'],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    cats: ['env-electronics', 'oldtech'],
    beings: { people: /programmer|scientist|engineer|android|robot/, cast: /cyborg|space|hacker/ },
    rooms: ['electronics', 'scifi', 'factory', 'lab'],
  },
  {
    id: 'street',
    name: 'Street',
    cats: ['env-street'],
    pick: { oldtech: /street-lamp|phone-booth|vending|signal/ },
    beings: { people: /police|fire|mail|courier|delivery|bus|crossing|tourist|punk|skater|runner|cyclist|reporter/ },
    rooms: ['nightstreet', 'street', 'station', 'shop'],
  },
  {
    id: 'urban',
    name: 'Urban',
    cats: ['env-urban'],
    pick: { household: /oil-drum|pallet|cage/, home: /tyre|fuel|cardboard|bin/ },
    beings: { people: /punk|burglar|security|builder|mechanic/, cast: /spy|agent|outlaw/ },
    rooms: ['alley', 'factory', 'station', 'prison', 'shop', 'sewer'],
  },
  {
    id: 'horror',
    name: 'Horror',
    cats: ['env-horror', 'eerie', 'occult'],
    beings: { apparitions: true },
    rooms: ['horror', 'asylum', 'morgue', 'prison', 'catacomb', 'sewer', 'crypt'],
  },
  {
    id: 'graveyard',
    name: 'Graveyard',
    cats: ['graveyard'],
    pick: { yard: /grave|cross|headstone|statue|crow|dead-tree|earth|lantern/ },
    beings: { apparitions: /ghost|skeleton|zombie|ghoul|sexton|crow|hanged|lantern|monk/, townsfolk: /gravedigger|priest/ },
    rooms: ['graveyard', 'cemetery', 'chapel', 'crypt', 'tomb', 'catacomb', 'ruin'],
  },
  {
    id: 'dream',
    name: 'Dream world',
    cats: ['env-dream'],
    beings: { apparitions: /ghost|shadow|moth|eyes|faceless|wraith/, cast: /fairy|genie|mermaid/ },
    rooms: ['dream', 'dreamscape', 'carnival', 'snow', 'seashore'],
  },
  {
    id: 'weird',
    name: 'Weird',
    cats: ['env-weird'],
    beings: { apparitions: /legs|tentacle|worms|centipede|eyes|hands|sack|mannequin|faceless|masked/ },
    rooms: ['weird', 'carnival', 'theatre'],
  },
  {
    id: 'castle',
    name: 'Castle and dungeon',
    cats: ['props', 'levelprops', 'barriers'],
    beings: { heroes: true, townsfolk: /king|queen|prince|guard|jester|noble|blacksmith|merchant/ },
    rooms: ['hall', 'cellar', 'crypt', 'tomb', 'cave', 'mineshaft', 'ruin'],
  },
  {
    id: 'wilds',
    name: 'Wild places',
    cats: ['nature'],
    pick: { yard: /tree|scarecrow|well/, graveyard: /tree|stump|stone|trilithon|ruin|gallows|gibbet/ },
    beings: { townsfolk: /shepherd|farmer|lumber|fisher/, apparitions: /crow|dog|bat|scarecrow|bog|witch/ },
    rooms: ['deadwood', 'marsh', 'moor', 'seashore', 'cornfield', 'snowwood', 'quarry', 'shipwreck', 'snow', 'cave'],
  },
  {
    id: 'apocalypse',
    name: 'Apocalypse',
    cats: ['env-apocalypse'],
    pick: { household: /oil-drum|pallet|generator|barrel|cage/, home: /tyre|fuel|cardboard/ },
    beings: { people: /soldier|paramedic|scientist|burglar|security|hiker|mechanic/, apparitions: /zombie|ghoul|plague|faceless|rat|crow|dog/ },
    rooms: ['apocalypse', 'ruin', 'factory', 'sewer', 'alley'],
  },
  {
    id: 'suburban',
    name: 'Suburban',
    cats: ['env-suburban'],
    pick: { home: /lawn|sofa|tv|fridge|barbecue|bin|bicycle|gnome|swing|pool|hose|washing-line/ },
    beings: {
      people: /mum|dad|man$|woman$|teen|kid|grand|baby|mail|police|delivery|gardener/,
      apparitions: /twins|masked-child|faceless|old-woman-window|cat/,
    },
    rooms: ['suburban', 'modern', 'kitchen', 'gardenwall'],
  },
  {
    id: 'village',
    name: 'Village',
    cats: ['env-village'],
    pick: { props: /barrel|bucket|table|stool|sack|well/, yard: /well|fence|gate|cart/ },
    beings: { townsfolk: true },
    rooms: ['village', 'cottage', 'cabin', 'chapel', 'shop'],
  },
  {
    id: 'rural',
    name: 'Rural',
    cats: ['env-rural'],
    pick: { yard: /scarecrow|well|fence|gate|hay|cart|trough|coop|kennel|tree/ },
    beings: {
      townsfolk: /farmer|shepherd|boy|girl|elder|granny|lumber/,
      people: /farmer|mechanic|hiker/,
      apparitions: /scarecrow|crow|black-dog|pumpkin|bog/,
    },
    rooms: ['rural', 'barn', 'cornfield', 'cabin', 'moor'],
  },
  {
    id: 'medieval',
    name: 'Medieval',
    cats: ['env-medieval', 'props'],
    beings: { heroes: true, townsfolk: true },
    rooms: ['medieval', 'hall', 'cellar', 'cabin', 'ruin'],
  },
  {
    id: 'gothic',
    name: 'Gothic',
    cats: ['env-gothic'],
    pick: { graveyard: /statue|angel|tomb|crypt|cross|gate|fence|coffin/, occult: /candle|altar|book|chalice|skull/ },
    beings: { townsfolk: /priest|gravedigger|noble/, apparitions: /monk|ghost|vampire|bat|hooded|sexton|hanged|crow|organ/ },
    rooms: ['gothic', 'chapel', 'crypt', 'tomb', 'catacomb', 'library'],
  },
  {
    id: 'apothecary',
    name: 'Apothecary',
    cats: ['env-apothecary'],
    pick: { madscience: /jar|flask|bottle|still|scale|specimen|skeleton|chart/, household: /jar|bottle|scales|shelf/ },
    beings: { townsfolk: /scholar|merchant|shopkeeper|fortune|granny|elder/, heroes: /alchemist|witch|druid/, apparitions: /plague|witch/ },
    rooms: ['apothecary', 'shop', 'lab', 'scullery', 'study'],
  },
  {
    id: 'oldtime',
    name: 'Old time',
    cats: ['env-oldtime', 'furniture'],
    beings: { townsfolk: true, cast: /cowboy|cowgirl|sheriff|outlaw|prospector/ },
    rooms: ['oldtime', 'parlour', 'oldhouse', 'station', 'shop', 'hotel'],
  },
  {
    id: 'twenties',
    name: '1920’s',
    cats: ['env-twenties'],
    pick: { oldtech: /radio|gramophone|telephone|typewriter|camera|projector/ },
    beings: {
      people: /detective|reporter|professor|police|waiter|singer|boss|judge|photographer|doctor/,
      cast: /spy|agent|ringmaster/,
      apparitions: /cultist|hooded|butler|faceless/,
    },
    rooms: ['twenties', 'hotel', 'theatre', 'library', 'study', 'station'],
  },
  {
    id: 'hell',
    name: 'Hell',
    cats: ['env-hell', 'occult'],
    beings: { apparitions: /cultist|wraith|hooded|skeleton|ghoul|hanged|shadow|monk-skull|hands|eyes/ },
    rooms: ['hell', 'catacomb', 'cave', 'crypt', 'horror'],
  },
  {
    id: 'nightmare',
    name: 'Nightmare',
    cats: ['env-nightmare'],
    beings: { apparitions: true },
    rooms: ['nightmare', 'horror', 'asylum', 'nursery', 'weird'],
  },
  {
    id: 'surreal',
    name: 'Surreal',
    cats: ['env-surreal'],
    beings: { apparitions: /legs|tentacle|eyes|hands|mannequin|faceless|masked|twins/, cast: /ringmaster|acrobat|juggler|strongman/ },
    rooms: ['surreal', 'dreamscape', 'weird', 'theatre', 'carnival'],
  },
];
/** Categories of things that belong to no setting in particular. */
export const OBJECT_CATS = ['clues'];

const slugOf = (item) => item.asset.replace(/^p:/, '');
/** The things (or beings) of an environment out of the library's categories ([{ id, items: [{ asset, name }] }]). */
export function environmentItems(env, cats, what = 'things') {
  const by = new Map(cats.map((c) => [c.id.replace(/^px-/, ''), c])),
    seen = new Set(),
    out = [];
  const take = (id, test) => {
    const c = by.get(id);
    if (!c) return;
    for (const it of c.items) {
      if (seen.has(it.asset) || (test instanceof RegExp && !test.test(slugOf(it)) && !test.test(it.name))) continue;
      seen.add(it.asset);
      out.push(it);
    }
  };
  if (what === 'beings') for (const [id, test] of Object.entries(env.beings || {})) take(id, test);
  else {
    for (const id of env.cats || []) take(id, true);
    for (const [id, test] of Object.entries(env.pick || {})) take(id, test);
  }
  return out;
}
