"""Swahili translations for the seeded FAQ items.

Keys are the English questions in :mod:`content.faq_data`. Each value holds the
Swahili question, answer and optional search keywords. The seed command merges
these into ``FaqItem.translations["sw"]``; editors can refine them in the CMS.

This is a machine-assisted first pass. "Piscine" is kept as a programme name
rather than translated to "bwawa" (pool).
"""

FAQ_TRANSLATIONS_SW = {
    "How to apply?": {
        "question": "Jinsi ya kuomba?",
        "answer": "Ili kuomba, unahitaji kufungua akaunti kupitia ukurasa wa Join us. Baada ya kufungua akaunti, unaweza kufanya mitihani ya utambuzi.",
        "keywords": "omba, ombi, jisajili, sajili, fungua akaunti, jiunge nasi, naombaje, mchakato wa maombi, anza, kujiunga, kuomba, kujisajili, ninaweza, jinsi ya kujiunga, nataka kujiunga",
    },
    "What is the online cognitive test?": {
        "question": "Mtihani wa utambuzi wa mtandaoni ni upi?",
        "answer": "Jaribio letu la utambuzi wa mtandaoni hudumu zaidi ya saa moja na nusu. Inajumuisha mchezo mfupi wa kumbukumbu, ikifuatiwa na mchezo mrefu wa mantiki.\n\nKukariri, utatuzi wa matatizo na ustadi wa kufikiri kimantiki ni viashiria vyema vya uwezo wako wa kuwa talanta bunifu ya kidijitali!\n\nHakuna uzoefu ya ukuzaji inayohitajika ili kukamilisha michezo na huhitaji kujiandaa kwa ajili yake.",
        "keywords": "mtihani wa utambuzi, mtihani wa mtandaoni, mchezo wa kumbukumbu, mchezo wa mantiki, michezo, mtihani ni kama nini, mtihani wa uwezo, tathmini",
    },
    "When can I apply?": {
        "question": "Ninaweza kutuma ombi lini?",
        "answer": "Maombi ni kwa msingi unaoendelea. Hatua ya kwanza ni kuchukua vipimo vya utambuzi mtandaoni. Angalia ukurasa huu - Jiunge nasi - ili kuunda wasifu wako na kisha kufikia majaribio.\n\nMatokeo ya majaribio ya utambuzi yanatathminiwa hivi punde ndani ya wiki 2 kabla ya kila Piscine. Ikiwa hakuna tarehe ya Piscine itatangazwa, maombi yanaweza kusimamishwa kwa muda. Katika hali hii, unaweza kushauriana na tovuti mara kwa mara ili uendelee kufahamishwa kuhusu tarehe Piscine zinazofuata.",
        "keywords": "naweza kutuma maombi lini, tarehe ya mwisho ya kutuma maombi, lini kuomba, rolling basis, dirisha la maombi, ulaji, maombi wazi, lini kuomba, muda wa maombi, nafasi.",
    },
    "How many times can I try the online cognitive test?": {
        "question": "Je, ninaweza kujaribu jaribio la utambuzi mtandaoni mara ngapi?",
        "answer": "Ukishaanza jaribio, huwezi kulisimamisha au kulianzisha upya. Una majaribio matatu ya kukamilisha majaribio ya mtandaoni na matokeo yako ya mwisho yatahesabiwa, kwa hivyo hakuna hatari kujaribu tena.",
        "keywords": "mara ngapi, majaribio, kurudia mtihani, jaribu tena, kushindwa mtihani, majaribio matatu, naweza kufanya mtihani tena",
    },
    "Who can apply?": {
        "question": "Nani anaweza kutuma maombi?",
        "answer": "Mafunzo ya Zone01 Kisumu ya kidijitali yako wazi kwa mtu yeyote aliye na umri wa zaidi ya miaka 18. Hakuna uzoefu wa awali wa programu au sifa za kitaaluma zinahitajika kuomba.\n\nUtofauti na Ujumuishi ni vipengele muhimu vya dhamira ya Zone01 Kisumu. Kwa hiyo tunawahimiza hasa wanawake, watu wenye ulemavu, watu kutoka katika mazingira duni, wakimbizi na makabila madogo kutuma maombi.",
        "keywords": "anayeweza kuomba anayestahili, anastahiki, anayestahili, mahitaji, umri, zaidi ya 18, sifa, je nahitaji uzoefu, can girls apply, women, sifa, mahitaji, nani anaweza kuomba, wanawake, kcse,grade, entry, no degree, without degree, no qualifications.",
    },
    "What are the qualities required?": {
        "question": "Ni sifa gani zinazohitajika?",
        "answer": "Hatufanyi majaribio ujuzi wako wa hesabu - shauku yako, ushirikiano, uvumilivu na ubunifu wako ni viashirio thabiti zaidi vya kupima uwezo wako wa kuandika msimbo. Mtaala wetu umeundwa kuwa na changamoto na mahitaji, na wanafunzi wetu wanapaswa kufanya kazi pamoja kwa ushirikiano, si kwa kushindana wao kwa wao.\n\nShauku - Unahitaji kuwa na shauku katika uendelezaji wa programu, pamoja na motisha kubwa ya kukuza ujuzi wako.\n\nUshirikiano - Ni muhimu kuweza kufanya kazi kama timu ili kukamilisha miradi na kushinda vizuizi.\n\nUbunifu - Utalazimika kupata haraka suluhisho za ubunifu na kufikiria njia tofauti za kutatua shida ngumu.\n\nUvumilivu - Ni muhimu kuweka motisha yako na kubaki makini licha ya ugumu unaoongezeka wa miradi inayotekelezwa.",
        "keywords": "sifa, ujuzi unaohitajika, shauku, ushirikiano, ubunifu, uvumilivu, je nahitaji hisabati, ujuzi wa hisabati, unatafuta nini",
    },
    "What are the different stages of the application procedure?": {
        "question": "Je, ni hatua gani tofauti za utaratibu wa maombi?",
        "answer": "Vipimo vya utambuzi - vipimo vya utambuzi mtandaoni vinavyojumuisha michezo miwili. Ukifaulu majaribio haya, utaalikwa kushiriki katika Piscine.\n\nPiscine - kipindi cha wiki nne cha kuzamishwa katika upangaji programu kulingana na miradi ya ana kwa ana. Ukipita Piscine hili, utaalikwa kujiandikisha katika mpango wa Zone01 Kisumu.\n\nTafadhali kumbuka: Piscine ni mchakato wa uchunguzi wa kina ili kupima uwezo wako wa kujifunza haraka, kufanya kazi kubwa, kushirikiana na watu wengine na, muhimu zaidi, kupima motisha yako.",
        "keywords": "hatua, hatua za maombi, mchakato, utaratibu wa maombi, hatua, nini kinatokea baadaye, mchakato wa uteuzi",
    },
    "If I can't attend the Piscine I have been accepted to participate in, are there other options?": {
        "question": "Iwapo siwezi kuhudhuria Piscine ambayo nimekubaliwa kushiriki, kuna chaguo zingine?",
        "answer": "Iwapo umewasiliana nawe ili kushiriki katika Piscine na huwezi kujiunga nasi kwa tarehe zilizoonyeshwa, tunapendekeza kwamba ushiriki katika Piscine zijazo ikiwa tarehe zimepangwa na kuna nafasi zinazopatikana.\n\nKwa vile idadi ya nafasi ni ndogo, ukiamua kushiriki katika Piscine inamaanisha kuwa unajua kuwa upo tayari kikamilifu kwa muda wa wiki 4.",
        "keywords": "siwezi kuhudhuria piscine, miss piscine, panga upya piscine, piscine ya siku zijazo, haipatikani, ahirisha, ahirisha",
    },
    "When will I know if I am accepted to participate in the Piscine?": {
        "question": "Nitajuaje ikiwa nimekubaliwa kushiriki katika Piscine?",
        "answer": "Iwapo umeorodheshwa kwenye Piscine, utawasiliana nawe kwa simu au barua pepe ndani ya wiki 2 kabla ya Piscine.",
        "keywords": "inapokubaliwa, kukubalika kwa piscine, kuorodheshwa, mwaliko, kuchaguliwa kwa piscine",
    },
    "When and where does the Piscine take place?": {
        "question": "Piscine inafanyika lini na wapi?",
        "answer": "Tutapanga Piscine kadhaa mfululizo pindi tu tunapokuwa na wagombeaji wa kutosha waliohitimu kutoka kwa michezo. Kila Piscine huchukua wiki 4. Piscine hufanyika kwenye kampasi, ana kwa ana, kwenye kampasi ya Zone01 Kisumu kilicho LakeHub, Lake Basin Mall huko Kisumu.",
        "keywords": "when piscine, where piscine, piscine date, next piscine, coming piscine, location, venue, campus, dates, how long, 4 weeks, kisumu, lake basin mall, piscine iko wapi, piscine ni lini, mahali, wapi, muda, lini, tarehe",
    },
    "I failed the Piscine, can I re-register?": {
        "question": "Nimeshindwa Piscine, ninaweza kujisajili upya?",
        "answer": "Iwapo umeshindwa Piscine, inawezekana kuchukua tena majaribio ya utambuzi ili kujaribu kuchaguliwa tena kwa Piscine. Hata hivyo, unapaswa kusubiri mwaka mmoja kabla ya kutuma ombi tena.",
        "keywords": "imeshindwa, jiandikishe tena, chukua tena piscine, tuma maombi tena, tuma tena, subiri mwaka, nafasi ya pili",
    },
    "What is the Piscine?": {
        "question": "Piscine ni nini?",
        "answer": "Piscine ni changamoto kubwa ya programu ya wiki 4 inayofanyika kwenye kampasi ya Zone01 Kisumu. Inategemea mfumo wa kipekee wa elimu wa Zone01. Utatekeleza kazi mbalimbali katika wiki hizo nne. Kila Ijumaa, utafanya mtihani wa kupima maendeleo yako binafsi. Mwishoni mwa wiki, miradi ya vikundi itakusaidia kuelewa na kuimarisha yale uliyojifunza wiki iliyopita. Ukikubaliwa kwenye Piscine, jiandae kwa wiki nne za bidii kubwa na mafanikio makubwa. Utapata marafiki wengi na kumbukumbu mpya, huku ukipata utangulizi kamili wa uendelezaji wa programu.",
        "keywords": "piscine ni nini, piscine maana yake, Piscine, changamoto ya wiki 4, bootcamp, mwezi wa uteuzi",
    },
    "How do you assess the Piscine participants?": {
        "question": "Je, unawatathmini vipi washiriki Piscine?",
        "answer": "Piscine, kama kozi nzima, inategemea tathmini ya wenzao. Hii inamaanisha kuwa utapokea pointi kwa kazi yote yaliyokamilishwa, ikiwa ni pamoja na miradi ya kikundi na makadirio unayokamilisha.\n\nPiscine hutathmini uwezo wako wa kujifunza haraka, kufanya kazi kubwa, kushirikiana na watu wengine na, zaidi ya yote, kujaribu motisha yako. Pia tunazingatia maadili ya kazi yako, mchango wako kwa ushirikiano na nia yako ya kujifunza wakati wa matumizi haya katika muda wote wa wiki 4.\n\nNi Piscine ambayo itaamua kama unaweza kuunganisha mafunzo au la, kwa sababu hatua hii inakuwezesha kutambua motisha yako, uwezo wako wa kutengeneza programu na utimilifu wako katika mbinu hii bunifu ya elimu.",
        "keywords": "kutathminiwa, kuweka alama, alama za piscine, jinsi washiriki wanatathminiwa, kufaulu au kushindwa, tathmini, alama",
    },
    "How will I know if I have been accepted into the Piscine?": {
        "question": "Nitajuaje ikiwa nimekubaliwa kwenye Piscine?",
        "answer": "Ukimaliza michezo, utaona kiwango ambacho umefikia kwa kila moja. Ikiwa umechaguliwa mapema baada ya michezo ya mtandaoni, utapigiwa simu au barua pepe ili kuhudhuria kipindi cha kikao cha kujiandikisha kabla ya kujiandikisha kwa Piscine. Kushiriki katika Piscine ni hatua ya 2 ya uteuzi. Ikiwa husikii kutoka kwetu, inamaanisha kuwa haujaorodheshwa, kwa sababu maombi ni mengi na kwa bahati mbaya hatuwezi kumjibu kila mtu wakati hajachaguliwa.",
        "keywords": "imekubaliwa katika piscine, tokeo la piscine, sikiliza, kikao cha kujiandikisha kipindi, hakuna jibu, haijachaguliwa, hatua ya pili",
    },
    "Is it an e-learning (distance) training?": {
        "question": "Je, ni mafunzo ya e-learning (umbali)?",
        "answer": "Hapana, mafunzo yanayotolewa na Zone01 Kisumu si mafunzo ya kielektroniki. Ni mafunzo ya ana kwa ana (kwenye kampasi).",
        "keywords": "mafunzo ya kielektroniki, mafunzo ya mtandaoni, madarasa ya mtandaoni, kozi ya mtandaoni, mtandaoni, zoom, kujifunza kwa umbali, ukiwa mbali, kusoma kutoka nyumbani, ni mtandaoni, kimwili, kwenye kampasi",
    },
    "How can we learn without teachers and lessons?": {
        "question": "Tunawezaje kujifunza bila walimu na masomo?",
        "answer": "Utajifunza kupitia jukwaa letu bunifu la 01Edu - kujifunza kwa wenzao na jukwaa la kujifunza lililoimarishwa, ambalo kupitia hilo maelfu ya watu duniani kote wamepata vipaji vya kidijitali vilivyo tayari kutumia. Kwa kushirikiana na wanafunzi wengine kwenye miradi ya kikundi, na pia kuboresha ujuzi wako mmoja mmoja, utapata seti kamili ya ujuzi.\n\nMfumo wa 01Edu una maagizo, video za usaidizi na vitendaji vilivyojumuishwa ili kufundisha kila mtu misingi ya upangaji programu. Jumuiya ya 01 inakuza uundaji wa akili ya pamoja. Vikundi vya masomo na gumzo vimepangwa ili kukuza usaidizi na kazi shirikishi. Katika muda wote wa mafunzo yako, timu ya Zone01 Kisumu itapatikana ili kujibu maswali yoyote ambayo unaweza kuwa nayo au kutoa usaidizi wa ziada ikihitajika.",
        "keywords": "hakuna walimu, hakuna masomo, rika kwa rika, 01edu, tunajifunzaje, kujisomea, jukwaa, hakuna wahadhiri",
    },
    "Can I be absent / take a vacation during the training?": {
        "question": "Je, ninaweza kutokuwepo / kuchukua likizo wakati wa mafunzo?",
        "answer": "Inawezekana kutokuwepo au kuchukua likizo mradi tu upate mafunzo. Kwa hivyo unaweza kuamua ni lini utakosekana katika mwaka wako wa kwanza wa mafunzo. Masharti ya kutokuwepo katika kipindi cha kazi na masomo yatabainishwa na timu.",
        "keywords": "kutokuwepo, likizo, kuondoka, likizo, wakati wa kupumzika, mapumziko wakati wa mafunzo",
    },
    "Do I have to have a laptop to be able to join the training?": {
        "question": "Je, ni lazima niwe na laptop ili niweze kujiunga na mafunzo?",
        "answer": "Kampasi kina vifaa vya kuruhusu kila mwanafunzi kufanya kazi kwenye kompyuta. Si lazima kuwa na kompyuta binafsi ili kuwa sehemu ya mafunzo.",
        "keywords": "laptop, kompyuta, je nahitaji laptop, vifaa, kompyuta yangu, kifaa, kompyuta ya mkononi, kifaa",
    },
    "If I don't want to complete the training, can I drop out during the course?": {
        "question": "Ikiwa sitaki kukamilisha mafunzo, ninaweza kuacha wakati wa kozi?",
        "answer": "Mtindo wetu wa elimu bila malipo unawezeshwa na makampuni washirika, ambao hufanya kazi nasi kuajiri watu wenye vipaji bora zaidi vya kidijitali. Ili kupokea mafunzo kamili katika upangaji programu na kukuhakikishia matarajio bora zaidi ya kazi, ni muhimu kukamilisha mafunzo yako.",
        "keywords": "kuacha, kuacha, kuacha kozi, kuacha mafunzo, kujiondoa",
    },
    "What support is available for learners on campus?": {
        "question": "Ni msaada gani unaopatikana kwa wanafunzi kwenye kampasi?",
        "answer": "Aina mbili za usaidizi hutolewa kwa wanafunzi na Zone01: msaada wa kiufundi na usaidizi kuhusu ustawi.\n\nUfundishaji wa kiufundi - wakati wanafunzi wamekwama kabisa kwenye tatizo, wanaweza kuuliza maswali na makocha wetu wa ufundi watapatikana ili kusaidia kuongoza fikra zao katika kutatua matatizo magumu bila kutoa jibu kamili!\n\nUsaidizi wa ustawi - watu wa rasilimali wanapatikana kwenye kampasi ili kuwasaidia wanafunzi kujisikia vizuri na kukabiliana na matatizo yoyote ambayo wanaweza kukutana nayo wakati wa kozi.",
        "keywords": "usaidizi, usaidizi, mafunzo, usaidizi wa kiufundi, ustawi, usaidizi wa wanafunzi, kukwama, usaidizi",
    },
    "Is the program full-time and how many days per week does it take?": {
        "question": "Je, programu ni ya muda wote na inachukua siku ngapi kwa wiki?",
        "answer": "Huu ni mpango wa kina unaozingatia kanuni ya kujifunza rika. Utalazimika kuhakikisha kuwa, wakati wa kazi ya kikundi, unaweza kufanya kazi kwa wakati mmoja na wanafunzi wengine.\n\nIli kutoa urahisi zaidi kwa kila mtu, kampasi kinafunguliwa saa 24 kwa siku, siku 7 kwa wiki.\n\nKwa hiyo ufikiaji wa kampasi unafanywa kwa njia ambayo unaweza kuja na kwenda bila vikwazo vya wakati.\n\nMpango huo unajiendesha yenyewe.",
        "keywords": "muda kamili, wa muda, siku kwa wiki, saa, ratiba, ratiba, siku ngapi, rahisi",
    },
    "How is the program graded over the three years? Is it a pass or fail system?": {
        "question": "Je, programu hiyo inawekwa alama gani katika kipindi cha miaka mitatu? Je, ni mfumo wa kupita au kushindwa?",
        "answer": "Huu si mfumo wa kupita au kushindwa, bali ni kuongezeka kwa changamoto unapoendelea kupitia mafunzo. Kuna miradi 60 tofauti ya kutatua wakati wa mafunzo na utapanda mara tu utakapomaliza kila mradi.\n\nAidha, ni kawaida kabisa kushindwa mradi! Hivi ndivyo unavyojifunza kutokana na makosa yako. Kama vile majaribio ya utambuzi unapotuma ombi, kozi imeundwa ili kuwafunza wasanidi programu full-stack waliobobea, kwa hivyo kiwango ni kigumu kimakusudi.",
        "keywords": "kupanga, kupandishwa daraja, kufaulu au kufeli, alama, mitihani, alama, tunapandishwaje daraja, ngazi, miradi",
    },
    "What programming languages will I learn?": {
        "question": "Nitajifunza lugha gani za programu?",
        "answer": "Utaonyeshwa kwa lugha kadhaa za programu. Kwa kutekeleza takriban miradi sitini, utajifunza kuandika msimbo katika JavaScript, Go na Rust, na vile vile C, C++, Ruby on Rails, PHP na Python. Utaweza kuandika msimbo katika mazingira mengi ya programu.",
        "keywords": "lugha, lugha za programu, nitajifunza nini, javascript, go, golang, rust, python, php, c++, ruby, tech stack, curriculum",
    },
    "What is Zone01 Kisumu?": {
        "question": "Zone01 Kisumu ni nini?",
        "answer": "Zone01 Kisumu inatoa programu ya mafunzo ya miaka 2 na ni mwanzo wa kazi yako kama msanidi wa full-stack, ikifuatiwa na mkataba wa kazi wa uhakika wa miaka 3. Inajumuisha:\n\n- Miezi 18 ya mafunzo ya bure, kwa kuzingatia azimio la miradi, ambayo itawawezesha kupata ujuzi kamili sana katika maendeleo ya programu.\n- Miezi 12 ya kazi na masomo ili kukuza ujuzi wako na kufanyia kazi miradi ya makampuni washirika.\n- Miezi 6 ya mafunzo ya kitaaluma juu ya miradi ya makampuni ya washirika.\n- Miaka 3 ya mkataba wa kazi iliyohakikishiwa.",
        "keywords": "zone01 ni nini, kuhusu mpango, muda, miaka 2, mkataba wa kazi, muhtasari, nani ni zone01, muda, kozi ni ya muda gani, mpango ni wa muda gani, urefu wa kozi, urefu, kozi, miaka, nyingi, muda, miaka, wiki, ni nini.",
    },
    "What are the qualities required by the Zone01 program / course?": {
        "question": "Je, ni sifa zipi zinazohitajika na mpango/kozi ya Zone01?",
        "answer": "Shauku - Unahitaji kuwa na shauku katika uendelezaji wa programu, pamoja na motisha kubwa ya kukuza ujuzi wako.\n\nUshirikiano - Ni muhimu kuweza kufanya kazi kama timu ili kukamilisha miradi na kushinda vizuizi.\n\nUbunifu - Utalazimika kupata haraka suluhisho za ubunifu na kufikiria njia tofauti za kutatua shida ngumu.\n\nUvumilivu - Ni muhimu kuweka motisha yako na kubaki makini licha ya ugumu unaoongezeka wa miradi inayotekelezwa.\n\nHatufanyi majaribio ujuzi wako wa hesabu - shauku yako, ushirikiano, uvumilivu na ubunifu wako ni viashirio thabiti zaidi vya kupima uwezo wako wa kuandika msimbo. Hii ndiyo sababu hatuajiri kwa misingi ya masomo: kila mtu ana nafasi yake katika Zone01 Kisumu, bila kujali kozi.\n\nMtaala wetu umeundwa kuwa na changamoto na mahitaji, na wanafunzi wetu wanapaswa kufanya kazi pamoja kwa ushirikiano, si kwa kushindana wao kwa wao.",
        "keywords": "sifa zinazohitajika, ninahitaji nini, sifa, ujuzi, shauku, ushirikiano, ubunifu, uvumilivu, hisabati",
    },
    "Can I work while I learn?": {
        "question": "Je, ninaweza kufanya kazi huku najifunza?",
        "answer": "Mafunzo ni dhamira kubwa, na haiwezekani kufanya kazi kwa muda wote wakati unafanya mafunzo.",
        "keywords": "kazi wakati wa kujifunza, kazi ya muda, ajira wakati wa mafunzo, naweza kufanya kazi, kazi ya upande",
    },
    "What support is available for people with learning difficulties?": {
        "question": "Je, ni msaada gani unaopatikana kwa watu wenye matatizo ya kujifunza?",
        "answer": "Timu ya Uzoefu wa Mwanafunzi iko hapa kukusaidia, kukuhimiza na kukusaidia kustawi. Wanatoa ushauri na mwongozo bora na wanaweza pia kutoa usaidizi wa kujifunza ili kukusaidia ikiwa unaishi na ulemavu au una shida ya kujifunza.",
        "keywords": "matatizo ya kujifunza, ulemavu, mahitaji maalum, upatikanaji, dyslexia, msaada kwa ulemavu",
    },
    "Do I have to be physically present on campus? Can I learn from home?": {
        "question": "Je, ni lazima niwepo kampasini kimwili? Je, ninaweza kujifunza kutoka nyumbani?",
        "answer": "Mafunzo hayo yanatokana na mbinu ya ufundishaji yenye ushirikiano wa hali ya juu na yenye mwelekeo wa jamii. Takriban 80% ya miradi katika mpango hufanywa kwa vikundi, ambayo ni rahisi na haraka kukamilisha mkiwa pamoja katika chumba kimoja.\n\nKampasi cha Zone01 Kisumu kinapatikana kwa saa 24 kwa siku, siku 7 kwa wiki, ili kuruhusu kila mtu kufanya kazi kwa urahisi katika nyakati zinazomfaa zaidi. Hata hivyo, tunawahimiza sana waombaji wetu kuchukua tahadhari wanapoondoka kampasini usiku sana au mapema asubuhi.\n\nTunakushauri sana uwepo kampasini wakati wote wa mafunzo, kwa sababu ni muhimu sana kuwa katika mazingira na kujifunza na kupitisha maarifa kwa wanajamii wengine. Inatia moyo sana kufanya kazi na kujifunza pamoja - mtaendelea haraka. Aidha, sisi hupanga mara kwa mara shughuli za kijamii na makongamano kwenye kampasi ili kuboresha uzoefu wako wa kujifunza.",
        "keywords": "kuwepo kimwili, kampasi kikuu, kujifunza kutoka nyumbani, kijijini, mahudhurio, lazima niwe kwenye kampasi, uwepo",
    },
    "What is the content of the three-year course?": {
        "question": "Ni nini maudhui ya kozi ya miaka mitatu?",
        "answer": "Katika miezi 18 ya kwanza, wanafunzi watagundua maktaba ya lugha ya Go, JavaScript na Rust. Kila lugha itahitaji miezi 6 ya kufanya kazi katika miradi, kuruhusu wanafunzi kuongeza uelewa wao wa lugha na kuchunguza dhana za ziada. Wanafunzi watagawanywa katika vikundi ili waweze kufanya kazi kama timu katika miradi.",
        "keywords": "maudhui ya kozi, kozi ya miaka mitatu, tutasoma nini, silabasi, miezi 18, go javascript rust",
    },
    "How much does the training cost?": {
        "question": "Mafunzo yanagharimu kiasi gani?",
        "answer": "Mafunzo ni bure. Hakuna ada za usajili, gharama za vitengo au ada za mitihani katika muda wote wa kozi.",
        "keywords": "cost, fees, tuition, how much, price, free, do i pay, bila ada, registration fee, bei, gharama, pesa, malipo, bure, ni bei gani",
    },
    "I don't have the means to support myself during the training. Are there scholarships?": {
        "question": "Sina njia ya kujikimu wakati wa mafunzo. Kuna masomo?",
        "answer": "Hakuna ada ya masomo na ufundishaji unaotolewa unaweza kuwezesha kufanya kazi kwa muda. Hata hivyo, tunaelewa kuwa gharama za usafiri, chakula au malazi hujumuisha bajeti inayopunguza uwezekano wa kufuata mafunzo. Kwa hivyo, tunatoa marupurupu ya kila mwezi ya Ksh 15,000 ili kusaidia wanafunzi wetu kukidhi baadhi ya gharama.\n\nTunaelewa kuwa hii haitoshi, kwa hivyo tunawahimiza watahiniwa kufanya mipango inayofaa ili kujikimu katika kipindi chote cha miaka 2 ya masomo.",
        "keywords": "scholarship, stipend, financial support, money, transport, food, accommodation, allowance, 15000, stipend amount, bursary, posho, msaada wa pesa, malazi, chakula, usafiri.",
    },
    "What work can I do?": {
        "question": "Ninaweza kufanya kazi gani?",
        "answer": "Utamaliza mafunzo kwa ujuzi wa kimataifa katika nyanja yoyote ya upangaji programu, pamoja na uzoefu wa kitaalamu uliopatikana katika kipindi cha miaka 1.5 cha kazi na masomo kilichotumika kushughulikia masuala madhubuti.\n\nHapa kuna kazi zinazopatikana baada ya mafunzo:\n\nKatika kikoa cha wavuti: Msanidi programu wa nyuma, msanidi wa mbele, mshauri wa e-commerce, mtaalamu mpya wa media, mtaalamu wa SEO, mchambuzi wa SEO, mshauri wa SEO, mbunifu wa uzoefu wa mtumiaji, mbuni wa UI, msimamizi wa maudhui ya wavuti, mbuni wa wavuti, msanidi wa wavuti, msimamizi wa wavuti.\n\nUsalama wa Mtandao: Mtaalamu wa uchunguzi wa kompyuta, mtaalamu wa mikakati ya usalama wa mtandao, mtaalamu wa cryptography, mtaalamu wa uhalifu wa mtandao, mtaalamu wa faragha, msimamizi wa usalama wa mtandao, mchambuzi wa usalama.\n\nMifumo ya Taarifa: DevOps, Msimamizi wa Hifadhidata, Mbunifu wa Biashara, Mchambuzi wa Uendeshaji wa IT, Msimamizi wa Mfumo, Mchambuzi wa Mfumo, Mbunifu wa Mfumo, Mhandisi wa Mfumo.\n\nMitandao: Mchambuzi wa mtandao, mhandisi wa mtandao, mhandisi wa mawasiliano ya simu, mtaalamu wa mawasiliano.\n\nProgramu: Mhandisi Mkuu wa Programu, Mhandisi Mtaalamu wa Uhakikisho wa Ubora, Msanidi Programu, Kidhibiti cha Usasishaji wa Programu, Kijaribu Programu.\n\nVifaa: Mhandisi wa vifaa, mhandisi wa vifaa vya elektroniki, mbuni wa mwingiliano.\n\nAkili Bandia: Msanidi wa algoriti, mtaalam wa akili bandia, mhandisi wa taswira ya kompyuta, Mtaalamu wa Mafunzo ya Mashine.\n\nData: Mchambuzi wa akili ya biashara, mtaalamu wa blockchain, mwanasayansi wa data, mchambuzi wa data, mchambuzi wa mfumo wa EDI, mpanga programu wa takwimu.\n\nMichezo ya video: Mbuni wa mchezo, msanidi wa mchezo, mtayarishaji wa mchezo, mtayarishaji programu, anayejaribu mchezo, mbuni wa moduli, msanii wa kiufundi.\n\nPicha: Kihuishaji cha 3D, msanidi wa 3D, kielelezo cha 3D, mbuni wa wahusika, msanidi wa Uhalisia Pepe, msanidi wa Uhalisia Pepe.\n\nNyingine: Mtaalamu wa miundombinu ya wingu, mkufunzi wa IT, mchezaji mtaalamu, meneja wa mradi, meneja wa bidhaa.",
        "keywords": "kazi gani, kazi, kazi, baada ya mafunzo, nafasi za kazi, majukumu, ajira, vyeo vya kazi, kazi za wasanidi",
    },
    "Where will I work after the 2-year training?": {
        "question": "Nitafanya kazi wapi baada ya mafunzo ya miaka 2?",
        "answer": "Baada ya kutumia miaka 2 kupata ujuzi unaohitajika ili kuwa msanidi wa full-stack, una uhakika wa kuajiriwa kulingana na chaguo hizi 3:\n\n- Fanya kazi kwa wakati wote katika wakala wetu wa talanta kwenye miradi mbali mbali ya kujitegemea.\n- Fanya kazi wakati wote kwa moja ya kampuni za washirika.\n- Unganisha mradi wako wa ujasiriamali na kazi ya muda katika wakala wetu wa talanta.",
        "keywords": "wapi nitafanya kazi, uwekaji, dhamana ya kazi, ajira, kampuni za washirika, wakala wa talanta, baada ya programu",
    },
    "Will I get a diploma or a certificate at the end of the training?": {
        "question": "Je, nitapata diploma au cheti mwishoni mwa mafunzo?",
        "answer": "Mwishoni mwa mafunzo yako, hupokea diploma au cheti, kwa sababu mfano huu haufanani na ufafanuzi wowote wa jadi.\n\nHili sio tatizo katika sekta ya digital, kwa sababu makampuni yanavutiwa na kile unachoweza kufanya, wewe ni nani na jinsi unavyofanya kazi. Kwa kuongeza, mwishoni mwa mafunzo yako una kazi ya uhakika, ambayo inakuwezesha kupata uzoefu wa kitaaluma.",
        "keywords": "diploma, cheti, shahada, kufuzu, napata cheti, kuhitimu, karatasi",
    },
    "How can I contact the Zone01 team?": {
        "question": "Ninawezaje kuwasiliana na timu ya Zone01?",
        "answer": "Tuma barua pepe kwa info@zone01kisumu.ke na timu itakujibu. Kwa maswali kuhusu maombi, tumia portal ya Join us kwenye learn.zone01kisumu.ke. Kwa masuala ya kuajiri au ushirikiano, tuma barua pepe kwa Torsten@lakehub.co.ke.",
        "keywords": "mawasiliano, wasiliana na wewe, barua pepe, barua pepe, barua pepe yako, anwani, nambari ya simu, wasiliana nawe, zungumza na mtu, binadamu, msaada, wasiliana, barua pepe, simu, msaada, mawasiliano",
    },
    "Where is the Zone01 Kisumu campus?": {
        "question": "Kampasi ya Zone01 Kisumu iko wapi?",
        "answer": "Kampasi yetu iko LakeHub, Lake Basin Mall, Kisumu. Iko wazi saa 24 kwa siku saba kwa wiki kwa wanafunzi. Tuma barua pepe kwa info@zone01kisumu.ke ikiwa unahitaji maelekezo kabla ya kuitembelea.",
        "keywords": "where are you located, located, campus location, address, directions, where is zone01, iko wapi, mahali, anwani, campus iko wapi",
    },
    "Do you have a campus in Nairobi or other towns?": {
        "question": "Mna kampasi Nairobi au miji mingine?",
        "answer": "Mafunzo yote na Piscine hufanyika kwenye kampasi yetu ya Kisumu, LakeHub, Lake Basin Mall. Hakuna kampasi nyingine mahali pengine; ukichaguliwa utahudhuria ana kwa ana huko Kisumu.",
        "keywords": "kampasi nyingine, kampasi huko nairobi, tawi, kampasi, kampasi nyingine, kampasi nyingine, tawi, kampasi ya nairobi.",
    },
    "I haven't received a reply to my application. What should I do?": {
        "question": "Sijapata jibu la ombi langu. Nifanye nini?",
        "answer": "Ikiwa umeorodheshwa kwa Piscine, tunawasiliana nawe kwa simu au barua pepe ndani ya wiki 2 kabla ya kuanza. Ikiwa husikii kutoka kwetu, hukuorodheshwa kwa ulaji huo. Angalia folda yako ya barua taka na lango la Jiunge nasi, na utume barua pepe kwa info@zone01kisumu.ke ikiwa huna uhakika.",
        "keywords": "no reply, no response, didn't heard back, application status, check application, shortlisted, spam folder, application update, maombi, majibu, hakuna jibu, hali ya maombi.",
    },
    "I can't log in to the application portal or I forgot my password.": {
        "question": "Siwezi kuingia kwenye lango la programu au nilisahau nenosiri langu.",
        "answer": "Tumia kiungo cha 'Umesahau nenosiri' kwenye learn.zone01kisumu.ke ili kuirejesha. Ikiwa bado huwezi kuingia, tuma barua pepe kwa info@zone01kisumu.ke na jina lako kamili na anwani ya barua pepe uliyojiandikisha nayo.",
        "keywords": "umesahau nywila, haiwezi kuingia, tatizo la kuingia, weka upya nenosiri, ufikiaji wa akaunti, portal, nimesahau nywila, kuingia, akaunti",
    },
    "The cognitive test is not loading. What should I do?": {
        "question": "Jaribio la utambuzi halipakii. Nifanye nini?",
        "answer": "Tumia muunganisho thabiti wa intaneti na kivinjari cha kisasa kama vile Chrome, kisha upakie upya ukurasa. Usianze jaribio hadi uwe tayari, kwa sababu haliwezi kusitishwa au kuwashwa upya. Ikiwa bado itashindikana, tuma barua pepe kwa info@zone01kisumu.ke na picha ya skrini.",
        "keywords": "test not loading, technical problem, error, page frozen, test crashed, browser, internet, mtihani, shida, hitilafu.",
    },
    "Can I visit the campus or attend an open day?": {
        "question": "Je, ninaweza kutembelea kampasi kikuu au kuhudhuria siku ya wazi?",
        "answer": "Ndiyo. Tunashiriki siku na matukio wazi kwenye tovuti yetu na chaneli za kijamii. Ili kupanga ziara ya kampasi kikuu, tuma barua pepe kwa info@zone01kisumu.ke na timu itapendekeza wakati mzuri.",
        "keywords": "visit, campus tour, open day, njoo kampasini, tazama kampasi, tukio, kutembelea, ziara, tukio",
    },
    "How do I report a problem or share feedback?": {
        "question": "Je, ninaripotije tatizo au kushiriki maoni?",
        "answer": "Tuma barua pepe kwa info@zone01kisumu.ke yenye maelezo mengi iwezekanavyo, ikijumuisha picha ya skrini ikiwa inasaidia. Tunasoma kila ujumbe na tutafuatilia.",
        "keywords": "maoni, malalamiko, ripoti tatizo, pendekezo, suala malalamiko, maoni, ripoti",
    },
    "What are the campus opening hours?": {
        "question": "Saa za ufunguzi wa kampasi ni ngapi?",
        "answer": "Kampasi iko wazi masaa 24 kwa siku, siku 7 kwa wiki kwa wanafunzi. Barua pepe ndiyo njia ya haraka zaidi ya kufikia timu, na tunajibu saa za kazi; kwa kutembelewa, tuma barua pepe kwanza ili mtu anayefaa apatikane.",
        "keywords": "saa za kazi, saa za kazi, unafungua lini, piga simu, muda wa kutembelea, saa za kazi, muda wa kazi, saa za kazi, saa za kufungua.",
    },
    "Can I apply if I live outside Kisumu?": {
        "question": "Je, ninaweza kutuma ombi ikiwa ninaishi nje ya Kisumu?",
        "answer": "Ndiyo, mtu yeyote anaweza kutuma maombi. Mafunzo hayo ni ya ana kwa ana mjini Kisumu, kwa hivyo ukichaguliwa utahitaji kuhudhuria kampasi binafsi.",
        "keywords": "outside kisumu, another county, relocate, move to kisumu, travel, distance, nje ya kisumu, mkoa, kuhamia.",
    },
    "Can I reapply if I was not selected?": {
        "question": "Je, ninaweza kutuma ombi tena ikiwa sikuchaguliwa?",
        "answer": "Ikiwa hukuorodheshwa kwa Piscine, unaweza kutuma ombi tena katika kipindi kijacho cha maombi. Ikiwa ulihudhuria Piscine na ukaishindwa, lazima usubiri mwaka mmoja kabla ya kutuma ombi tena.",
        "keywords": "omba upya, tuma maombi tena, haujachaguliwa, haujafaulu, umekataliwa, jaribu tena, ulaji unaofuata, kuomba tena, hakuchaguliwa.",
    },
    "Is the Piscine free?": {
        "question": "Piscine ni bure?",
        "answer": "Ndiyo. Piscine ni sehemu ya mchakato wa uteuzi na hakuna ada ya kuhudhuria. Programu nzima ni bila ada.",
        "keywords": "ada ya piscine, lipia piscine, gharama ya piscine, piscine bila malipo, malipo ya piscine, bure, gharama",
    },
    "Can I miss a day during the Piscine?": {
        "question": "Je, ninaweza kukosa siku moja wakati wa Piscine?",
        "answer": "Piscine ni mchakato wa uteuzi wa wiki 4 wa wiki 4 na unahitaji kupatikana kikamilifu kwa kipindi chote. Ikiwa dharura itatokea, wasiliana na timu haraka iwezekanavyo katika info@zone01kisumu.ke.",
        "keywords": "kukosa siku, kutokuwepo wakati wa piscine, ruka piscine, haipatikani, dharura, kutokuwepo, dharura",
    },
    "Do I need a laptop or my own internet to join?": {
        "question": "Je, ninahitaji kompyuta ya mkononi au intaneti yangu ili kujiunga?",
        "answer": "Hapana. Kampasi hiki kina kompyuta na intaneti kwa ajili ya wanafunzi, kwa hivyo huhitaji kompyuta yako ndogo. Kwa programu ya mtandaoni na majaribio ya utambuzi, unahitaji tu kifaa kilicho na muunganisho thabiti wa intaneti.",
        "keywords": "laptop, kompyuta, intaneti, wifi, data, kifaa, simu, kompyuta, mtandao, kifaa",
    },
    "What language is the training in?": {
        "question": "Mafunzo hayo ni kwa lugha gani?",
        "answer": "Nyenzo za mafunzo na miradi ziko kwa Kiingereza, na timu yetu inaweza pia kukusaidia kwa Kiswahili. Huhitaji cheti cha lugha ili kuomba.",
        "keywords": "lugha, lugha ya kufundishia, kufundisha, kufundishia, kufundishia, lugha ya kufundishia, kiingereza, kiswahili, kiswahili, lugha, kizungu, cheti",
    },
    "How should I prepare for the Piscine?": {
        "question": "Je, nijitayarishe vipi kwa Piscine?",
        "answer": "Hakuna kitu cha kitaaluma cha kujiandaa - Piscine hujaribu jinsi unavyojifunza na kufanya kazi na wengine. Njoo umepumzika, tayari kwa wiki nne za kina, na ulete motisha yako. Kompyuta hutolewa kwenye kampasi.",
        "keywords": "jiandae kwa piscine, tayari kwa piscine, nini cha kuleta, maandalizi ya piscine, kabla ya piscine, kujiandaa, tayari",
    },
    "Is accommodation or food provided?": {
        "question": "Je, malazi au chakula hutolewa?",
        "answer": "Wanafunzi hupanga malazi na milo yao wenyewe huko Kisumu. Wakati wa mafunzo, posho ya kila mwezi husaidia kwa usafiri, chakula na gharama za malazi. Tuma barua pepe kwa info@zone01kisumu.ke ikiwa ungependa ushauri kabla ya Piscine.",
        "keywords": "accommodation, housing, hosteli, where to stay, meals, food, malazi, chakula, hosteli, mahali pa kulala, ninaweza, kupata, ninaweza kupata malazi.",
    },
    "How much is the monthly stipend and when does it start?": {
        "question": "Je, ni pesa ngapi ya kila mwezi na inaanza lini?",
        "answer": "Wanafunzi wanaostahiki hupokea Ksh 15,000 kila mwezi wakati wa mafunzo ili kusaidia usafiri, chakula na malazi. Timu itathibitisha tarehe kamili ya kuanza na maelezo ya malipo utakapojiandikisha.",
        "keywords": "stipend, allowance, monthly pay, when stipend, how much stipend, posho, malipo ya kila mwezi, msaada wa pesa.",
    },
    "How can I hire Zone01 talent?": {
        "question": "Ninawezaje kuajiri talanta ya Zone01?",
        "answer": "Tembelea ukurasa wa Hire Talent kwenye zone01kisumu.ke au barua pepe Torsten@lakehub.co.ke na jukumu unaloajiri. Unaweza pia kutuma ujumbe kwa timu ya vipaji kwenye WhatsApp kwa wa.me/254748902779.",
        "keywords": "kuajiri vipaji, mwajiri, kuajiri, kuajiri watengenezaji, kuajiri, ajira",
    },
    "How can I partner with or support Zone01?": {
        "question": "Je, ninawezaje kushirikiana na au kuunga mkono Zone01?",
        "answer": "Tungependa kusikia kutoka kwako. Tuma barua pepe kwa info@zone01kisumu.ke au Torsten@lakehub.co.ke kwa ushirikiano, ufadhili au mazungumzo ya kukodisha.",
        "keywords": "mshirika, ushirikiano, mfadhili, changia, eneo la usaidizi01, ushirikiano, ushirikiano, kuchangia, msaada",
    },
}
