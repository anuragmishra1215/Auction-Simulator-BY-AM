// Career totals for international cricket (Tests + ODIs + T20Is), sourced from Cricbuzz.
// Portraits are Cricbuzz profile thumbnails. Stats are a snapshot as of 26 Oct 2026.
const rows = `
Virat Kohli|India|565|28527|9|86|c616517/virat-kohli.jpg|1413/virat-kohli
MS Dhoni|India|538|17266|1|16|c170677/ms-dhoni.jpg|265/ms-dhoni
Sachin Tendulkar|India|664|34357|201|100|c171004/sachin-tendulkar.jpg|25/sachin-tendulkar
Rohit Sharma|India|517|20652|12|52|c616514/rohit-sharma.jpg|576/rohit-sharma
Suresh Raina|India|322|7987|62|7|c148324/suresh-raina.jpg|413/suresh-raina
KL Rahul|India|243|10094|0|23|c616523/kl-rahul.jpg|8733/kl-rahul
Shubman Gill|India|149|7625|0|23|c616515/shubman-gill.jpg|11808/shubman-gill
Ishan Kishan|India|101|3140|0|3|c846036/ishan-kishan.jpg|10276/ishan-kishan
Rajat Patidar|India|4|85|0|0|c760758/rajat-patidar.jpg|10636/rajat-patidar
Abhishek Sharma|India|69|2127|12|3|c846031/abhishek-sharma.jpg|12086/abhishek-sharma
Jasprit Bumrah|India|243|471|511|0|c846037/jasprit-bumrah.jpg|9311/jasprit-bumrah
Cheteshwar Pujara|India|108|7246|0|19|c332890/cheteshwar-pujara.jpg|1448/cheteshwar-pujara
Hardik Pandya|India|243|4724|222|1|c846032/hardik-pandya.jpg|9647/hardik-pandya
Ravindra Jadeja|India|377|7580|644|6|c616520/ravindra-jadeja.jpg|587/ravindra-jadeja
Ravichandran Ashwin|India|287|4394|765|6|c591961/ravichandran-ashwin.jpg|1593/ravichandran-ashwin
Kuldeep Yadav|India|199|515|379|0|c846039/kuldeep-yadav.jpg|8292/kuldeep-yadav
Bhuvneshwar Kumar|India|232|1171|295|0|c244967/bhuvneshwar-kumar.jpg|1726/bhuvneshwar-kumar
Ishant Sharma|India|199|865|434|0|c154520/ishant-sharma.jpg|702/ishant-sharma
Umesh Yadav|India|141|561|288|0|c332901/umesh-yadav.jpg|1858/umesh-yadav
Yuvraj Singh|India|402|11778|148|17|c171064/yuvraj-singh.jpg|69/yuvraj-singh
Rishabh Pant|India|159|5805|0|9|c616524/rishabh-pant.jpg|10744/rishabh-pant
Shreyas Iyer|India|170|5690|0|7|c616518/shreyas-iyer.jpg|9428/shreyas-iyer
Sanju Samson|India|95|2326|0|4|c846035/sanju-samson.jpg|8271/sanju-samson
Arshdeep Singh|India|119|193|178|0|c846038/arshdeep-singh.jpg|13217/arshdeep-singh
Mohammed Siraj|India|116|263|238|0|c591952/mohammed-siraj.jpg|10808/mohammed-siraj
Yuzvendra Chahal|India|152|83|217|0|c244981/yuzvendra-chahal.jpg|7910/yuzvendra-chahal
Manish Pandey|India|68|1275|0|1|c171022/manish-pandey.jpg|1836/manish-pandey
Gautam Gambhir|India|242|10324|0|20|c154519/gautam-gambhir.jpg|308/gautam-gambhir
Zaheer Khan|India|309|2035|610|0|c150980/zaheer-khan.jpg|71/zaheer-khan
Harbhajan Singh|India|367|3570|711|2|c153922/harbhajan-singh.jpg|75/harbhajan-singh
AB de Villiers|South Africa|420|20014|9|47|c170999/ab-de-villiers.jpg|370/ab-de-villiers
Hashim Amla|South Africa|349|18672|0|55|c170633/hashim-amla.jpg|314/hashim-amla
Faf du Plessis|South Africa|262|11198|2|23|c593786/faf-du-plessis.jpg|7825/faf-du-plessis
Kagiso Rabada|South Africa|259|1687|597|0|c846108/kagiso-rabada.jpg|9585/kagiso-rabada
Imran Tahir|South Africa|165|306|293|0|c170764/imran-tahir.jpg|6667/imran-tahir
Quinton de Kock|South Africa|328|13547|0|31|c846114/quinton-de-kock.jpg|8520/quinton-de-kock
David Miller|South Africa|320|7568|0|10|c846103/david-miller.jpg|6349/david-miller
Heinrich Klaasen|South Africa|122|3245|0|4|c619866/heinrich-klaasen.jpg|10209/heinrich-klaasen
Chris Morris|South Africa|69|774|94|0|c170696/chris-morris.jpg|8333/chris-morris
Marco Jansen|South Africa|87|1685|184|0|c846113/marco-jansen.jpg|14565/marco-jansen
JP Duminy|South Africa|326|9154|132|10|c170693/jean-paul-duminy.jpg|211/jp-duminy
Brendon McCullum|New Zealand|432|14676|1|19|c156149/brendon-mccullum.jpg|201/brendon-mccullum
Martin Guptill|New Zealand|367|13463|12|23|c244827/martin-guptill.jpg|1457/martin-guptill
Tom Latham|New Zealand|295|11712|0|25|c616421/tom-latham.jpg|8216/tom-latham
Trent Boult|New Zealand|253|1033|611|0|c351612/trent-boult.jpg|8117/trent-boult
Matt Henry|New Zealand|174|993|377|0|c845495/matt-henry.jpg|9067/matt-henry
Tim Southee|New Zealand|394|3290|776|0|c601546/tim-southee.jpg|1057/tim-southee
Mitchell Santner|New Zealand|301|3849|367|1|c845505/mitchell-santner.jpg|10100/mitchell-santner
Devon Conway|New Zealand|148|6292|0|13|c845526/devon-conway.jpg|9838/devon-conway
Daryl Mitchell|New Zealand|206|7135|27|15|c845511/daryl-mitchell.jpg|10713/daryl-mitchell
Sam Curran|England|151|2296|166|0|c848527/sam-curran.jpg|10420/sam-curran
Jos Buttler|England|424|12969|0|15|c848523/jos-buttler.jpg|2258/jos-buttler
Jason Roy|England|185|5980|0|12|c170941/jason-roy.jpg|6534/jason-roy
Dawid Malan|England|114|4416|4|8|c351857/dawid-malan.jpg|6660/dawid-malan
Jofra Archer|England|116|714|222|0|c848536/jofra-archer.jpg|11540/jofra-archer
Ben Stokes|England|279|11321|352|19|c717787/ben-stokes.jpg|6557/ben-stokes
Jonny Bairstow|England|287|11581|0|23|c351851/jonny-bairstow.jpg|6507/jonny-bairstow
Moeen Ali|England|298|6678|366|8|c597794/moeen-ali.jpg|6692/moeen-ali
Kane Williamson|New Zealand|378|19346|73|48|c616418/kane-williamson.jpg|6326/kane-williamson
Shakib Al Hasan|Bangladesh|447|14730|712|14|c351919/shakib-al-hasan.jpg|544/shakib-al-hasan
Mushfiqur Rahim|Bangladesh|482|16252|0|23|c616471/mushfiqur-rahim.jpg|394/mushfiqur-rahim
Mahmudullah|Bangladesh|430|11046|166|9|c616462/mahmudullah.jpg|1121/mahmudullah
Lasith Malinga|Sri Lanka|340|978|546|0|c170724/lasith-malinga.jpg|111/lasith-malinga
Dushmantha Chameera|Sri Lanka|155|537|202|0|c847167/dushmantha-chameera.jpg|8393/dushmantha-chameera
Kumar Sangakkara|Sri Lanka|594|28016|0|63|c155723/kumar-sangakkara.jpg|104/kumar-sangakkara
Mahela Jayawardene|Sri Lanka|652|25957|14|54|c153241/mahela-jayawardene.jpg|101/mahela-jayawardene
Mohammad Amir|Pakistan|159|1179|271|0|c170813/mohammad-amir.jpg|1917/mohammad-amir
Babar Azam|Pakistan|356|16082|2|32|c846059/babar-azam.jpg|8359/babar-azam
Mohammad Rizwan|Pakistan|256|9075|0|8|c616445/mohammad-rizwan.jpg|9468/mohammad-rizwan
Shaheen Shah Afridi|Pakistan|217|973|415|0|c846065/shaheen-afridi.jpg|12160/shaheen-afridi
Haris Rauf|Pakistan|157|274|246|0|c616449/haris-rauf.jpg|14561/haris-rauf
Hasan Ali|Pakistan|152|937|262|0|c352428/hasan-ali.jpg|11320/hasan-ali
Chris Gayle|West Indies|483|19594|260|42|c170801/chris-gayle.jpg|247/chris-gayle
Darren Sammy|West Indies|232|3781|209|1|c157791/daren-sammy.jpg|253/darren-sammy
Jason Holder|West Indies|305|6219|433|3|c845501/jason-holder.jpg|8313/jason-holder
Dwayne Bravo|West Indies|295|6423|363|5|c171033/dwayne-bravo.jpg|242/dwayne-bravo
Sunil Narine|West Indies|122|558|165|0|c152654/sunil-narine.jpg|2276/sunil-narine
Andre Russell|West Indies|143|2158|132|0|c170821/andre-russell.jpg|7736/andre-russell
Kieron Pollard|West Indies|224|4275|97|3|c226283/kieron-pollard.jpg|657/kieron-pollard
Lendl Simmons|West Indies|144|3763|8|2|c157836/lendl-simmons.jpg|599/lendl-simmons
David Warner|Australia|383|18995|4|49|c352449/david-warner.jpg|1739/david-warner
Travis Head|Australia|207|9416|45|21|c845768/travis-head.jpg|8497/travis-head
Pat Cummins|Australia|224|2376|535|0|c352460/pat-cummins.jpg|8095/pat-cummins
Mitchell Starc|Australia|306|3224|777|0|c352462/mitchell-starc.jpg|7710/mitchell-starc
Josh Hazlewood|Australia|239|748|538|0|c845819/josh-hazlewood.jpg|6258/josh-hazlewood
Matthew Wade|Australia|225|4682|0|5|c244799/matthew-wade.jpg|1649/matthew-wade
Glenn Maxwell|Australia|286|7226|136|10|c845944/glenn-maxwell.jpg|7662/glenn-maxwell
Aaron Finch|Australia|254|8804|4|19|c244784/aaron-finch.jpg|1643/aaron-finch
Steve Smith|Australia|364|17897|64|49|c619873/steven-smith.jpg|2250/steve-smith
Marcus Stoinis|Australia|158|2911|101|1|c845974/marcus-stoinis.jpg|8989/marcus-stoinis
Chris Lynn|Australia|22|366|0|0|c154633/chris-lynn.jpg|7752/chris-lynn
Jake Fraser-McGurk|Australia|15|213|0|0|c619874/jake-fraser-mcgurk.jpg|14501/jake-fraser-mcgurk
James Faulkner|Australia|94|1237|138|1|c156209/james-faulkner.jpg|7789/james-faulkner
Lungi Ngidi|South Africa|159|282|263|0|c846112/lungi-ngidi.jpg|9603/lungi-ngidi
Tristan Stubbs|South Africa|84|2171|0|3|c846116/tristan-stubbs.jpg|19243/tristan-stubbs
Rilee Rossouw|South Africa|65|2006|1|5|c593768/rilee-rossouw.jpg|2244/rilee-rossouw
Eoin Morgan|England|379|10859|0|16|c170936/eoin-morgan.jpg|624/eoin-morgan
Harshit Rana|India|30|232|46|0|c616529/harshit-rana.jpg|24729/harshit-rana
Will Jacks|England|86|1818|52|0|c848529/will-jacks.jpg|12258/will-jacks
Shikhar Dhawan|India|269|10867|0|24|c170660/shikhar-dhawan.jpg|1446/shikhar-dhawan
`.trim();

const photoBase = 'https://static.cricbuzz.com/a/img/v1/i1/';
export const PLAYERS = rows.split('\n').map(line => {
  const [name,country,matches,runs,wickets,hundreds,portrait,profile] = line.split('|');
  return {name,country,matches:+matches,runs:+runs,wickets:+wickets,hundreds:+hundreds,
    photo:`${photoBase}${portrait}?d=low&p=gthumb`,source:`https://www.cricbuzz.com/profiles/${profile}`};
});
// Main auction role for each player. Spin and pace bowlers get their own tags;
// recognised all-rounders retain that role even when they also bowl spin/pace.
const roles = {
  'Virat Kohli':'Batsman','MS Dhoni':'Wicketkeeper','Sachin Tendulkar':'Batsman','Rohit Sharma':'Batsman',
  'Suresh Raina':'All-rounder','KL Rahul':'Wicketkeeper','Shubman Gill':'Batsman','Ishan Kishan':'Wicketkeeper',
  'Rajat Patidar':'Batsman','Abhishek Sharma':'All-rounder','Jasprit Bumrah':'Fast bowler','Cheteshwar Pujara':'Batsman',
  'Hardik Pandya':'All-rounder','Ravindra Jadeja':'All-rounder','Ravichandran Ashwin':'All-rounder','Kuldeep Yadav':'Spinner',
  'Bhuvneshwar Kumar':'Fast bowler','Ishant Sharma':'Fast bowler','Umesh Yadav':'Fast bowler','Yuvraj Singh':'All-rounder',
  'Rishabh Pant':'Wicketkeeper','Shreyas Iyer':'Batsman','Sanju Samson':'Wicketkeeper','Arshdeep Singh':'Fast bowler',
  'Mohammed Siraj':'Fast bowler','Yuzvendra Chahal':'Spinner','Manish Pandey':'Batsman','Gautam Gambhir':'Batsman',
  'Zaheer Khan':'Fast bowler','Harbhajan Singh':'Spinner','AB de Villiers':'Wicketkeeper','Hashim Amla':'Batsman',
  'Faf du Plessis':'Batsman','Kagiso Rabada':'Fast bowler','Imran Tahir':'Spinner','Quinton de Kock':'Wicketkeeper',
  'David Miller':'Batsman','Heinrich Klaasen':'Wicketkeeper','Chris Morris':'All-rounder','Marco Jansen':'All-rounder',
  'JP Duminy':'All-rounder','Brendon McCullum':'Wicketkeeper','Martin Guptill':'Batsman','Tom Latham':'Wicketkeeper',
  'Trent Boult':'Fast bowler','Matt Henry':'Fast bowler','Tim Southee':'Fast bowler','Mitchell Santner':'All-rounder',
  'Devon Conway':'Wicketkeeper','Daryl Mitchell':'All-rounder','Sam Curran':'All-rounder','Jos Buttler':'Wicketkeeper',
  'Jason Roy':'Batsman','Dawid Malan':'Batsman','Jofra Archer':'Fast bowler','Ben Stokes':'All-rounder',
  'Jonny Bairstow':'Wicketkeeper','Moeen Ali':'All-rounder','Kane Williamson':'Batsman','Shakib Al Hasan':'All-rounder',
  'Mushfiqur Rahim':'Wicketkeeper','Mahmudullah':'All-rounder','Lasith Malinga':'Fast bowler',
  'Dushmantha Chameera':'Fast bowler','Kumar Sangakkara':'Wicketkeeper','Mahela Jayawardene':'Batsman',
  'Mohammad Amir':'Fast bowler','Babar Azam':'Batsman','Mohammad Rizwan':'Wicketkeeper','Shaheen Shah Afridi':'Fast bowler',
  'Haris Rauf':'Fast bowler','Hasan Ali':'Fast bowler','Chris Gayle':'All-rounder','Darren Sammy':'All-rounder',
  'Jason Holder':'All-rounder','Dwayne Bravo':'All-rounder','Sunil Narine':'All-rounder','Andre Russell':'All-rounder',
  'Kieron Pollard':'All-rounder','Lendl Simmons':'Wicketkeeper','David Warner':'Batsman','Travis Head':'Batsman',
  'Pat Cummins':'Fast bowler','Mitchell Starc':'Fast bowler','Josh Hazlewood':'Fast bowler','Matthew Wade':'Wicketkeeper',
  'Glenn Maxwell':'All-rounder','Aaron Finch':'Batsman','Steve Smith':'Batsman','Marcus Stoinis':'All-rounder',
  'Chris Lynn':'Batsman','Jake Fraser-McGurk':'Batsman','James Faulkner':'All-rounder','Lungi Ngidi':'Fast bowler',
  'Tristan Stubbs':'Wicketkeeper','Rilee Rossouw':'Batsman','Eoin Morgan':'Batsman','Harshit Rana':'Fast bowler',
  'Will Jacks':'All-rounder','Shikhar Dhawan':'Batsman'
};
for (const player of PLAYERS) player.role = roles[player.name] || 'Batsman';
