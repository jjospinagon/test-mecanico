/* =========================================================================
   questions-en.js — English version of the question bank.
   Keys are "test-question". Options keep the same order as the Spanish
   version, so the correct index ("a" in questions.js) applies to both.
   ========================================================================= */
window.QUESTIONS_EN = {
  /* ---------------- TEST 1 — Fundamentals ---------------- */
  '1-1': {
    q: "Gear A turns clockwise. Which way does gear C turn?",
    o: ["Clockwise", "Counterclockwise", "It doesn't turn: the system locks"],
    e: "Every time two gears mesh directly, the direction of rotation reverses. A turns clockwise, so B turns counterclockwise, and C, which meshes with B, turns clockwise again. Rule of thumb: in a row of gears, those in odd positions (1st, 3rd, 5th…) turn the same way as the first one and those in even positions turn the opposite way. The system would only lock if three gears formed a closed triangle, all meshing with each other."
  },
  '1-2': {
    q: "Gear A, with 40 teeth, drives gear B, with 10 teeth. If A makes one full turn, how many turns does B make?",
    o: ["A quarter turn", "One turn", "Four turns", "Ten turns"],
    e: "The same number of teeth passes through the contact point on both gears. One turn of A moves 40 teeth past that point, and B completes a turn every 10 teeth: 40 ÷ 10 = 4 turns. The smaller gear always turns faster than the larger one; in exchange, it delivers less turning force (torque)."
  },
  '1-3': {
    q: "The fixed pulley in the drawing holds a 30 kg load. Ignoring friction, what force F must be applied to the rope?",
    o: ["The equivalent of 10 kg", "The equivalent of 15 kg", "The equivalent of 30 kg", "The equivalent of 60 kg"],
    e: "A fixed pulley gives no mechanical advantage: it only changes the direction of the force (you pull down to raise the load). The load hangs from a single section of rope, and that section must carry the whole weight, so the force is the equivalent of 30 kg. Its benefit is convenience: pulling down lets you use your own body weight."
  },
  '1-4': {
    q: "The bar rests on its center and its weight is negligible. What mass X must be placed at the right end to balance it?",
    o: ["5 kg", "10 kg", "20 kg", "40 kg"],
    e: "A lever is balanced when the moments on each side of the pivot are equal (moment = weight × distance to the pivot). Left side: 20 kg × 2 m = 40 kg·m. Right side: X × 4 m = 40 kg·m, so X = 10 kg. At twice the distance you need half the weight."
  },
  '1-5': {
    q: "Each spring stretches 2 cm when 10 N hangs from it. If two of these springs are joined end to end (in series) and the same 10 N is hung from them, how much does the pair stretch?",
    o: ["1 cm", "2 cm", "4 cm", "8 cm"],
    e: "In series, each spring carries the full load: both the upper and the lower spring take 10 N, and each stretches 2 cm. The total stretch is the sum: 2 cm + 2 cm = 4 cm. A series pair is softer than a single spring; if the springs were placed side by side (in parallel), each would carry half and the stretch would be 1 cm."
  },
  '1-6': {
    q: "In the circuit, switch S is open. Which bulbs light up?",
    o: ["Only X", "Only Y", "X and Y", "Neither"],
    e: "The two bulbs are in series: the current has a single path through the battery, X, Y and the switch. With S open that path is broken, no current flows anywhere in the circuit and neither bulb lights. In a series circuit, a single break (an open switch or a blown bulb) turns everything off."
  },
  '1-7': {
    q: "A 12 V battery powers a 4 Ω resistor. What current does ammeter A read?",
    o: ["0.33 A", "3 A", "8 A", "48 A"],
    e: "By Ohm's law, current equals voltage divided by resistance: I = V ÷ R = 12 V ÷ 4 Ω = 3 A. To remember it: V = I × R; if you know two of the three quantities, you can solve for the third. The other options come from dividing the wrong way (4 ÷ 12), subtracting (12 − 4) or multiplying (12 × 4)."
  },
  '1-8': {
    q: "The three containers have the same mass, evenly distributed. Which one tips over most easily when pushed from the side?",
    o: ["Container A", "Container B", "Container C", "All three equally"],
    e: "An object tips over when the vertical line down from its center of gravity falls outside its base. C has the narrowest base and the highest center of gravity, so tilting it only slightly is enough for that line to leave the base. A, with a wide base and a low center of gravity, is the most stable. That is why heavy loads go at the bottom and tall equipment is anchored or given a wider base."
  },
  '1-9': {
    q: "The tank is filled with water to the level shown. If all three holes are opened at once, which one does the water come out of with the most pressure?",
    o: ["Hole A", "Hole B", "Hole C", "The same from all three"],
    e: "Pressure in a liquid increases with depth, because each point carries the weight of the whole column of water above it (P = ρ · g · h). Hole C is the deepest, so water comes out of it with the most pressure and the highest speed. For the same reason, tanks and retaining walls are reinforced at the bottom."
  },
  '1-10': {
    q: "Pulley A turns clockwise and drives pulley B with a crossed belt. Which way does B turn?",
    o: ["Clockwise", "Counterclockwise", "It depends on the size of the pulleys"],
    e: "With an open (uncrossed) belt, both pulleys turn the same way. When the belt is crossed in a figure 8, the direction reverses, just like two meshing gears. Since A turns clockwise, B turns counterclockwise. The size of the pulleys changes the speed, not the direction."
  },
  '1-11': {
    q: "The same box must be raised to the same height using one of these ramps. Without friction, which ramp needs the least force to push it?",
    o: ["Ramp A", "Ramp B", "Ramp C", "All three need the same force"],
    e: "The work needed to raise the box is the same on all three ramps (weight × height), and that work equals force × distance traveled. On ramp C the box travels the longest distance, so the force needed is the smallest: F = weight × height ÷ ramp length. In exchange, you have to push over a longer distance. It is the principle behind access ramps and roads that zigzag up a hillside."
  },
  '1-12': {
    q: "The pendulum is released from point A. Without friction, at which point is it moving fastest?",
    o: ["Point A", "Point B", "Point C", "Point D"],
    e: "Once released, the pendulum converts potential energy (height) into kinetic energy (speed). At the ends, A and D, it stops for an instant and its speed is zero. As it swings down it gains speed, reaching its maximum at C, the lowest point of the path, where all the height lost has turned into motion. From there it starts to rise and slow down."
  },
  '1-13': {
    q: "A very tight nut must be loosened by applying force at the end of the handle. Which wrench needs less force?",
    o: ["Wrench A", "Wrench B", "Both need the same force"],
    e: "What loosens the nut is torque: force × distance between the hand and the center of the nut. Wrench B has the longer handle, so a smaller force produces the same torque. If B is twice as long as A, half the force is enough. That is why a long-handled wrench or an extension pipe is used on stuck nuts."
  },
  '1-14': {
    q: "In the hydraulic press, 50 N is applied to the small piston, which has an area of 10 cm². What force is produced at the large piston, which has an area of 100 cm²?",
    o: ["5 N", "50 N", "500 N", "5,000 N"],
    e: "By Pascal's principle, pressure applied to an enclosed liquid is transmitted equally to every point. Pressure at the small piston: 50 N ÷ 10 cm² = 5 N/cm². That same pressure acts on the large one: 5 N/cm² × 100 cm² = 500 N. The force is multiplied by the ratio of the areas (100 ÷ 10 = 10). In exchange, the large piston moves ten times less than the small one."
  },
  '1-15': {
    q: "The pinion turns clockwise, meshed with the rack below it. The pinion's axle does not move. Which way does the rack move?",
    o: ["To the left", "To the right", "It doesn't move; it only vibrates"],
    e: "When it turns clockwise, the top of the pinion moves to the right and the bottom moves to the left. The rack is meshed with the bottom of the pinion, so it is dragged to the left. This mechanism turns rotation into straight-line motion; it is used in vehicle steering and in motorized sliding gates."
  },
  '1-16': {
    q: "With switch S open, what happens to the bulbs?",
    o: ["X and Y light up", "Only X lights up", "Only Y lights up", "Neither lights up"],
    e: "The bulbs are in parallel: each has its own path between the battery terminals. Switch S is only in X's branch, so opening it breaks only that branch. Y's branch is still complete and Y stays on. Household wiring works the same way: turning off one lamp doesn't turn off the others."
  },
  '1-17': {
    q: "The bar, whose weight is negligible, is balanced. Which of the two loads is heavier?",
    o: ["Load A", "Load B", "They weigh the same"],
    e: "When balanced, the moments are equal: weight of A × 1 m = weight of B × 3 m. For that to hold, A must weigh three times as much as B. The load closer to the pivot is the heavier one: a light load can balance a heavy one if it is placed farther from the pivot."
  },
  '1-18': {
    q: "The 80 kg load hangs from a movable pulley. Ignoring friction and the weight of the pulley, what force F is needed to hold it?",
    o: ["The equivalent of 20 kg", "The equivalent of 40 kg", "The equivalent of 80 kg", "The equivalent of 160 kg"],
    e: "The movable pulley is held by two sections of rope: one tied to the ceiling and the one being pulled. Each section carries half the load, so the force needed is 80 kg ÷ 2 = 40 kg. The trade-off is distance: to raise the load 1 m you must pull 2 m of rope."
  },
  '1-19': {
    q: "The wheel turns at a constant speed. Which of the two points travels farther on each turn and is therefore moving faster?",
    o: ["Point A", "Point B", "Both move equally fast"],
    e: "Both points make the same number of turns per minute (the same angular speed), but B traces a much larger circle. Each turn it covers a circumference of 2π × its radius, so its linear speed grows in proportion to its distance from the center (v = ω × r). Since B is almost three times as far from the center as A, it moves almost three times as fast."
  },
  '1-20': {
    q: "The three containers are connected by a pipe at the bottom. Water is poured into A until everything settles. How do the water levels end up?",
    o: ["Highest in A, where the water goes in", "Highest in B, the widest one", "Highest in C, the funnel-shaped one", "At the same level in all three"],
    e: "Containers connected at the bottom are called communicating vessels. At rest, the pressure at the bottom must be the same at every connected point, and the pressure in a liquid depends only on depth, not on the shape or width of the container. That is why the water settles at the same level in A, B and C. It is the principle of the water-tube level used on construction sites to transfer elevations."
  },

  /* ---------------- TEST 2 — Intermediate ---------------- */
  '2-1': {
    q: "Each gear meshes only with the next one in the chain. If A turns counterclockwise, which way does D turn?",
    o: ["Clockwise", "Counterclockwise", "It can't be known without the number of teeth"],
    e: "The direction reverses at each mesh: A counterclockwise, B clockwise, C counterclockwise and D clockwise. D is in the fourth (even) position, so it turns opposite to A. The number of teeth changes each gear's speed, never its direction."
  },
  '2-2': {
    q: "Pinion A, with 12 teeth, turns at 60 rpm and drives wheel B, with 36 teeth. At how many rpm does B turn?",
    o: ["20 rpm", "36 rpm", "60 rpm", "180 rpm"],
    e: "Speed is shared in inverse proportion to the number of teeth: rpm of B = rpm of A × teeth of A ÷ teeth of B = 60 × 12 ÷ 36 = 20 rpm. B has three times as many teeth, so it turns three times slower but delivers three times the torque. This is how a speed reducer works."
  },
  '2-3': {
    q: "A (20 teeth) drives B (40 teeth). C (10 teeth) is mounted on the same shaft as B and drives D (30 teeth). If A makes 12 turns, how many turns does D make?",
    o: ["2 turns", "4 turns", "6 turns", "36 turns"],
    e: "Solve it stage by stage. A to B: 12 × 20 ÷ 40 = 6 turns of B. C is on the same shaft as B, so it also makes 6 turns. C to D: 6 × 10 ÷ 30 = 2 turns of D. In a compound train, the total reduction is the product of the reductions of each stage: (40 ÷ 20) × (30 ÷ 10) = 6, which is why D turns 6 times slower than A."
  },
  '2-4': {
    q: "The block and tackle in the drawing holds a 200 kg load. Without friction or pulley weight, what force F is needed?",
    o: ["The equivalent of 25 kg", "The equivalent of 50 kg", "The equivalent of 100 kg", "The equivalent of 200 kg"],
    e: "To find the mechanical advantage of a block and tackle, count the rope sections holding up the movable block (the lower one, which rises with the load). Here there are 4. The load is shared among them, so each section, and therefore the hand, carries 200 kg ÷ 4 = 50 kg. The section being pulled doesn't count, because it comes off the fixed pulley and runs down to the hand."
  },
  '2-5': {
    q: "The wheelbarrow carries 60 kg whose center is 0.5 m from the wheel axle. The handles are 1.5 m from the axle. Ignoring the weight of the wheelbarrow, what force is needed at the handles to lift it?",
    o: ["The equivalent of 10 kg", "The equivalent of 20 kg", "The equivalent of 30 kg", "The equivalent of 60 kg"],
    e: "A wheelbarrow is a second-class lever: the pivot is the wheel axle, the load is in the middle and the force is applied at the end. Moments about the axle: 60 kg × 0.5 m = F × 1.5 m, so F = 30 ÷ 1.5 = 20 kg. The closer to the wheel the load is placed, the less force is needed at the handles."
  },
  '2-6': {
    q: "A single spring stretches 3 cm under a 30 N load. If two springs identical to it are placed side by side (in parallel) and together hold the same 30 N, how much does the pair stretch?",
    o: ["0.75 cm", "1.5 cm", "3 cm", "6 cm"],
    e: "In parallel, the load is shared between the two springs: each carries 15 N, half. Since stretch is proportional to force (Hooke's law), each spring stretches half as much: 3 cm ÷ 2 = 1.5 cm. Both stretch the same amount because they are joined by the same bar. The parallel pair is twice as stiff as a single spring."
  },
  '2-7': {
    q: "Both batteries and all four bulbs are identical. In which circuit do the bulbs shine brighter?",
    o: ["In circuit A", "In circuit B", "They shine the same in both"],
    e: "In circuit A, the bulbs in series share the battery voltage: each gets half and shines dimly. In circuit B, in parallel, each bulb is connected directly to the battery and gets the full voltage, so it shines at full brightness. The trade-off is that circuit B draws more current and drains the battery faster."
  },
  '2-8': {
    q: "A heater connected to 120 V draws a current of 10 A. What is its power?",
    o: ["12 W", "130 W", "1,200 W", "12,000 W"],
    e: "Electric power is voltage times current: P = V × I = 120 V × 10 A = 1,200 W (1.2 kW). If it runs for one hour it uses 1.2 kWh, the unit energy is billed in. The other options come from dividing (120 ÷ 10), adding (120 + 10) or slipping a zero."
  },
  '2-9': {
    q: "Two identical trucks carry the same three boxes, loaded differently. Seen from behind, which one is more likely to tip over when taking a curve?",
    o: ["Truck A", "Truck B", "They have the same risk"],
    e: "In a curve, a sideways force acts at the center of gravity of the truck and its load. The higher that point, the greater the moment trying to roll the truck over its outer wheels. A has the boxes stacked high, with a high center of gravity, and tips first. The loading rule: heavy items low and centered."
  },
  '2-10': {
    q: "Water flows from left to right through the pipe, which is always full. In which section does it flow fastest?",
    o: ["Section A", "Section B", "Section C", "The same speed in all three"],
    e: "If the pipe is full and there are no leaks, the same flow rate passes through every section (Q = area × velocity). Where the area is smaller, the velocity must be higher for the same volume to pass each second. B is the narrowest section, so the water moves fastest there. It is the same effect as covering part of a hose outlet with your thumb."
  },
  '2-11': {
    q: "Why are dam walls built much thicker at the base than at the crest?",
    o: ["Because water pressure increases with depth", "Because the water at the bottom is colder", "Because it makes the wall lighter", "Because the water pushes with the same pressure over the whole height"],
    e: "Water pressure grows in proportion to depth (P = ρ · g · h): it is practically zero at the surface and greatest at the bottom. The thrust on the wall is therefore much larger near the bottom, and the cross-section widens toward the base to resist it. Temperature differences in the water have a negligible effect compared with depth."
  },
  '2-12': {
    q: "Pulley A turns clockwise. A drives B with an open belt, and B drives C with a crossed belt. Which way does C turn?",
    o: ["Clockwise", "Counterclockwise", "C does not turn"],
    e: "The open belt keeps the direction: B turns the same way as A, clockwise. The crossed belt reverses it: C turns opposite to B, counterclockwise. Just count the crossed belts: if their number is odd, the last pulley turns opposite to the first."
  },
  '2-13': {
    q: "A force of 50 N is applied perpendicular to the handle, 0.3 m from the center of the nut. What torque does the nut receive?",
    o: ["1.5 N·m", "15 N·m", "150 N·m", "167 N·m"],
    e: "Torque is the force multiplied by the perpendicular distance to the axis of rotation: M = F × d = 50 N × 0.3 m = 15 N·m. If the force were not perpendicular to the handle, only its perpendicular component would count and the torque would be smaller. Torque wrenches let you tighten bolts to a specified value, as many structural connections require."
  },
  '2-14': {
    q: "A 400 N load is pushed up a ramp 6 m long to a height of 1.5 m. Without friction, what force parallel to the ramp is needed?",
    o: ["100 N", "150 N", "267 N", "400 N"],
    e: "Lifting the load straight up takes work of weight × height = 400 N × 1.5 m = 600 J. Along the ramp the same work is done, but over 6 m: F × 6 m = 600 J, so F = 100 N. The mechanical advantage of an inclined plane is length ÷ height = 6 ÷ 1.5 = 4: you need a quarter of the force."
  },
  '2-15': {
    q: "The cam in the drawing has two identical lobes and turns on its shaft. How many times does the rod rise and fall for each full turn of the cam?",
    o: ["Once", "Twice", "Four times", "Never; the rod stays still"],
    e: "The rod (follower) rests on the cam's profile and rises each time a lobe, a part farther from the shaft, passes under it. Both lobes pass in one full turn, so the rod rises and falls twice. Cams turn rotation into back-and-forth motion; this is how an engine's valves open and close."
  },
  '2-16': {
    q: "Two resistors, 4 Ω and 8 Ω, are connected in series to a 24 V battery. What current does the ammeter read?",
    o: ["1 A", "2 A", "3 A", "6 A"],
    e: "In series, resistances add: total R = 4 Ω + 8 Ω = 12 Ω. By Ohm's law, I = V ÷ R = 24 V ÷ 12 Ω = 2 A, the same current throughout the circuit. The 4 Ω resistor gets 8 V and the 8 Ω resistor gets 16 V; together they add up to the battery's 24 V."
  },
  '2-17': {
    q: "The bar rests on its center and its weight is negligible. What mass X is needed to balance it?",
    o: ["5 kg", "10 kg", "15 kg", "20 kg"],
    e: "Add up the moments on each side. Left: 30 kg × 2 m = 60 kg·m. Right: 20 kg × 1.5 m + X × 3 m = 30 + 3X. Setting them equal: 60 = 30 + 3X, so X = 10 kg. When there are several loads on the same side, their moments add up."
  },
  '2-18': {
    q: "The same wooden block is floated in fresh water and in salt water. In which one does it float higher, with less of it underwater?",
    o: ["In fresh water", "In salt water", "The same in both"],
    e: "An object floats when the weight of the liquid it displaces equals its own weight (Archimedes' principle). Salt water is denser: each liter weighs more, so the block needs to displace less volume to balance its weight and floats higher. That is why it is easier to float in the sea than in a pool, and why a ship sits a little lower when it moves from the sea into a river."
  },
  '2-19': {
    q: "A roller coaster car starts from rest at A and rolls along the track without friction. At which point is it fastest?",
    o: ["Point A", "Point B", "Point C", "Point D"],
    e: "Without friction, total energy is conserved: the height the car loses turns into speed. So the speed at each point depends only on how far it has dropped below A, not on the shape of the track. C is the lowest point of the whole ride; there it has lost the most height and has the highest speed. At A the speed is zero because it starts from rest."
  },
  '2-20': {
    q: "A bolt has a thread pitch of 2 mm. How many full turns must the nut be given to advance 10 mm?",
    o: ["2 turns", "5 turns", "10 turns", "20 turns"],
    e: "The pitch is the distance the nut advances in one full turn (on a single-start thread, the distance between two crests). To advance 10 mm with a 2 mm pitch takes 10 ÷ 2 = 5 turns. A fine-pitch thread advances less per turn, but it clamps harder and is less likely to loosen with vibration."
  },

  /* ---------------- TEST 3 — Advanced ---------------- */
  '3-1': {
    q: "A and C have 20 teeth each; B, the gear between them, has 50. If A turns clockwise at 100 rpm, how does C turn?",
    o: ["At 100 rpm, clockwise", "At 100 rpm, counterclockwise", "At 40 rpm, clockwise", "At 250 rpm, counterclockwise"],
    e: "B is an idler gear: its number of teeth does not change the overall ratio. A to B: 100 × 20 ÷ 50 = 40 rpm. B to C: 40 × 50 ÷ 20 = 100 rpm, the same as if A meshed directly with C. What the idler does do is reverse the direction one more time: A clockwise, B counterclockwise, C clockwise. It is used to keep the direction of rotation or to bridge the distance between two shafts."
  },
  '3-2': {
    q: "A single-start worm drives a 40-tooth wheel. How many turns must the worm make for the wheel to make one full turn?",
    o: ["1 turn", "4 turns", "20 turns", "40 turns"],
    e: "With a single-start worm, each turn of the worm moves the wheel forward exactly one tooth. For the 40-tooth wheel to complete a turn, the worm must turn 40 times: a 40 to 1 reduction. Because of this large reduction, and because the wheel usually cannot turn the worm, it is used in winches, sluice gates and guitar tuning pegs."
  },
  '3-3': {
    q: "The 120 kg load hangs from the lower block of the tackle. Without friction or pulley weight, what force F is needed to hold it?",
    o: ["The equivalent of 30 kg", "The equivalent of 40 kg", "The equivalent of 60 kg", "The equivalent of 120 kg"],
    e: "Count the rope sections holding up the lower block: the one tied to it and the two passing around its pulley, 3 in total. The load is shared among them: 120 kg ÷ 3 = 40 kg. Tying the end of the rope to the movable block, instead of the fixed one, adds a supporting section and increases the mechanical advantage."
  },
  '3-4': {
    q: "The forearm works as a lever: the pivot is the elbow, the muscle pulls up 5 cm from the elbow and the hand holds 5 kg at 30 cm. Ignoring the weight of the forearm, how much force does the muscle exert?",
    o: ["The equivalent of 0.8 kg", "The equivalent of 5 kg", "The equivalent of 30 kg", "The equivalent of 150 kg"],
    e: "This is a third-class lever: the force is applied between the pivot and the load. Moments about the elbow: F × 5 cm = 5 kg × 30 cm, so F = 150 ÷ 5 = 30 kg. This kind of lever needs more force than the load, but in exchange the hand moves much faster and farther than the point where the muscle pulls. Tweezers and brooms work the same way."
  },
  '3-5': {
    q: "All the springs are identical and each stretches 1 cm for every 10 N of load. How far does the 20 N load drop from its unloaded position?",
    o: ["1.5 cm", "2 cm", "3 cm", "4 cm"],
    e: "Analyze it in parts. The lower spring carries the whole load, 20 N, and stretches 2 cm. The two upper springs are in parallel and share those 20 N: each carries 10 N and stretches 1 cm, so the bar drops 1 cm. The total drop of the load is the sum: 1 cm + 2 cm = 3 cm."
  },
  '3-6': {
    q: "In the circuit, switch A is closed and switch B is open. Which bulbs light up?",
    o: ["X, Y and Z", "X and Z", "Only Z", "None"],
    e: "X is in the main line, in series with everything else; Y and Z are in parallel with each other. With A closed, current leaves the battery and passes through X. Where the circuit splits, Y's branch is cut by B, but Z's branch is complete. The current returns to the battery through Z, so X and Z light up. If A were opened, everything would go out, because it is in the main line."
  },
  '3-7': {
    q: "Two 6 Ω resistors are connected in parallel to a 12 V battery. What current does ammeter A in the main line read?",
    o: ["1 A", "2 A", "4 A", "6 A"],
    e: "Each resistor is connected directly to the 12 V of the battery, so each carries I = 12 V ÷ 6 Ω = 2 A. The ammeter is in the main line and measures the sum of both branches: 2 A + 2 A = 4 A. Put another way, two identical resistors in parallel are equivalent to half of one (3 Ω), and 12 V ÷ 3 Ω = 4 A."
  },
  '3-8': {
    q: "A uniform bar 4 m long and weighing 10 kg has a 10 kg block hanging from its left end. At which point must it be supported to balance?",
    o: ["At A, 0.5 m from the left end", "At B, 1 m from the left end", "At C, 1.5 m from the left end", "At D, the center of the bar"],
    e: "The weight of a uniform bar acts at its center, 2 m from the end. The support must be at the center of gravity of the whole: (10 kg × 0 m + 10 kg × 2 m) ÷ 20 kg = 1 m from the left end, that is, at B. Check with moments about B: the block gives 10 kg × 1 m = 10 kg·m on the left, and the bar 10 kg × 1 m = 10 kg·m on the right."
  },
  '3-9': {
    q: "In a hydraulic jack, the small piston (5 cm²) moves down 10 cm. How far does the large piston (50 cm²) rise?",
    o: ["0.1 cm", "1 cm", "10 cm", "100 cm"],
    e: "Oil is practically incompressible: the volume pushed by the small piston is the same volume that enters under the large one. Volume displaced: 5 cm² × 10 cm = 50 cm³. At the large piston: 50 cm³ ÷ 50 cm² = 1 cm. The force is multiplied by 10, but the travel is divided by 10; the work (force × distance) is the same at the input and the output. That is why you have to pump a jack's handle many times to raise a car a few centimeters."
  },
  '3-10': {
    q: "A machine weighing 1,200 N rests on a base whose contact area with the floor is 0.4 m². What pressure does it exert on the floor?",
    o: ["480 Pa", "1,200 Pa", "3,000 Pa", "30,000 Pa"],
    e: "Pressure is force spread over area: P = F ÷ A = 1,200 N ÷ 0.4 m² = 3,000 Pa (3 kPa). Doubling the contact area halves the pressure. Footings are sized with the same criterion: the base is enlarged until the pressure is below what the soil can bear."
  },
  '3-11': {
    q: "The motor pulley, 10 cm in diameter, turns at 1,200 rpm and drives a 30 cm diameter pulley with a belt. At how many rpm does the large pulley turn?",
    o: ["133 rpm", "400 rpm", "1,200 rpm", "3,600 rpm"],
    e: "The belt moves at the same speed over both pulleys, so rpm is inversely proportional to diameter: rpm of the large pulley = 1,200 × 10 ÷ 30 = 400 rpm. The large pulley turns three times slower but with three times the torque. This is how an electric motor's speed is reduced to drive a mixer or a pump."
  },
  '3-12': {
    q: "The three blocks are solid and uniform, and friction keeps them from sliding. A is wider than it is tall, B is a cube and C is four times taller than it is wide. On this 25° slope, which one tips over?",
    o: ["Block A", "Block B", "Block C", "None"],
    e: "A block on a slope tips over when the vertical line drawn from its center of gravity falls outside its base. For a uniform block this happens when the tangent of the slope exceeds the width ÷ height ratio. Here the tangent of 25° is ≈ 0.47. A (width ÷ height ≈ 2.4) and B (= 1) are well above that value and stay put. C is four times taller than it is wide (width ÷ height = 0.25): the vertical line from its center of gravity falls outside the base and it tips over."
  },
  '3-13': {
    q: "At the same instant, ball A is dropped from the left edge of the table and ball B is launched horizontally off the right edge. Without air resistance, which one hits the floor first?",
    o: ["Ball A", "Ball B", "They land at the same time"],
    e: "Horizontal and vertical motion are independent. Both balls start at the same height with zero vertical speed, and gravity accelerates them downward in exactly the same way, so they take the same time to fall. B's horizontal speed only makes it land farther away, not later. From a height of 0.8 m, for example, both take about 0.4 s."
  },
  '3-14': {
    q: "A 2 m bar of negligible weight is used to lift a 700 N stone at one end. The pivot is 0.25 m from the stone. What force must be applied at the other end?",
    o: ["100 N", "175 N", "350 N", "700 N"],
    e: "Load arm: 0.25 m. Effort arm: 2 m − 0.25 m = 1.75 m. Balancing moments: F × 1.75 m = 700 N × 0.25 m = 175 N·m, so F = 100 N. A bar with its pivot close to the load is a first-class lever with a mechanical advantage of 1.75 ÷ 0.25 = 7."
  },
  '3-15': {
    q: "A 20-tooth pinion meshes with a rack whose teeth are 5 mm apart (pitch). If the pinion makes one full turn, how far does the rack move?",
    o: ["20 mm", "50 mm", "100 mm", "200 mm"],
    e: "In one full turn, all 20 teeth of the pinion pass the contact point, and each pushes the rack forward one tooth, that is, one pitch. Travel = 20 teeth × 5 mm = 100 mm. If the pinion makes half a turn, the rack moves 50 mm; the travel is always proportional to the rotation."
  },
  '3-16': {
    q: "The bimetallic strip is made of brass (top) and steel (bottom), firmly bonded. Brass expands more than steel when heated. When the strip is heated, which way does its free end bend?",
    o: ["Up, toward the brass side", "Down, toward the steel side", "It doesn't bend; it only gets longer"],
    e: "When heated, the brass gets longer than the steel, but since they are bonded, the strip can only absorb that difference by bending. The layer that expands more ends up on the outside of the curve and the one that expands less on the inside. The brass is on the outside, on top, so the strip bends down, toward the steel. This principle is used in thermostats and thermal switches."
  },
  '3-17': {
    q: "The siphon is full of water and both ends are underwater. Until when does water flow from tank A to tank B?",
    o: ["Until A is completely empty", "Until the levels in A and B are equal", "Until B is filled to the brim", "No water flows, because it would have to go uphill"],
    e: "A siphon works because of the difference in level between the water surfaces of the two tanks: the column on B's side is longer, weighs more and pulls the water along, while atmospheric pressure pushes the water in A up the tube. As long as the level in A is higher than in B, water flows from A to B. When the levels are equal, the difference that drives it disappears and the flow stops. If the end of the tube in A were left in the air first, the siphon would lose its prime."
  },
  '3-18': {
    q: "A bicycle's chainring has 48 teeth and the rear sprocket has 16. How many turns does the rear wheel make for each full turn of the pedals?",
    o: ["A third of a turn", "1 turn", "3 turns", "32 turns"],
    e: "One turn of the chainring pulls 48 chain links, and the sprocket makes one turn every 16 links: 48 ÷ 16 = 3 turns. The rear wheel is fixed to the sprocket, so it also makes 3 turns. With a larger sprocket the ratio drops: pedaling is easier, but the bike travels less per pedal stroke."
  },
  '3-19': {
    q: "A 2,400 W electric oven runs on 120 V. Which fuse is the most suitable to protect it?",
    o: ["10 A", "15 A", "25 A", "60 A"],
    e: "First work out the normal operating current: I = P ÷ V = 2,400 W ÷ 120 V = 20 A. The fuse must carry that current without blowing, which rules out 10 A and 15 A. It must also blow on an overload or a short circuit, so you choose the next rating above the normal current: 25 A. A 60 A fuse would let currents dangerous to the wiring through without cutting the circuit."
  },
  '3-20': {
    q: "The three pendulums are released from a small angle. Which one takes longest to complete a full back-and-forth swing?",
    o: ["A, the one with the heaviest mass", "B, the one with the longest string", "C", "All three take the same time"],
    e: "For small swings, a pendulum's period depends only on the length of the string and on gravity: T = 2π √(L ÷ g). Mass has no effect, so A and C, which have the same length, swing at the same rate even though A is heavier. B has the longest string and is the slowest. For a pendulum to take twice as long per swing, its string must be four times longer."
  }
};
