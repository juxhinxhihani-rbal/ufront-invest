/* eslint-disable @typescript-eslint/naming-convention */

export enum ResegmentCustomerSteps {
  Resegmentation,
  EditData,
  ChargedAccount,
  Review,
  Attachments,
}

export enum PremiumSegments {
  IndividePremium = 86,
  PunonjesTeKompanivePrivatePremium = 87,
  PunonjesiteAdminPublikePremium = 90,
  IndividePremiumClub = 175,
  PunonjesiteAdminPubPrmClub = 176,
  PunonjesTeKompanivePrivatePrmClub = 177,
  IndividePremiumPaketaClassic = 178,
  PunonjesiteAdmPublikePrmPaketaClassic = 179,
  PunonjesTeKompanivePrivatePrmPaketaClassic = 180,
  IndividePremiumTePataksueshem = 192,
  PunonjesiteAdmPublikePremiumClubExtra = 245,
  IndividPremiumJoRes = 103,
  PunonjesAdmPublikeJoRes = 230,
  PunonjesKompanivePrivateJoRes = 231,
  IndividPremiumClubJoRes = 232,
  PunonjesAdmPublikeClubJoRes = 233,
  PunonjesKompaniPrivatePremiumClubJoRes = 234,
  IndividPremiumPaketaClassicJoRes = 235,
  PunonjesAdmPublikePremiumClassicJoRes = 236,
  PunonjesKompanivePrivatePremiumClassicJoRes = 237,
  MassJoRes = 100,
  PremiumJoRes = 101,
  IndividProdukteNonRetailJoRes = 226,
}

export enum AddedInfoEnums {
  AmlExemptionId = 1,
  CustRiskClassificationId = 3,
}

export enum CustomerSegment {
  IndivideKidTeMitur = 18,
  IndivideKidPagamarres = 110,
  PersonaTeLidhurMeKredi = 78,
  PersonaTeLidhurPerKarte = 79,
  PersonaTeLidhurPerKredi = 80,
  BebetETiranes = 112,
  RaiffeisenStudent = 305,
}

export enum Age {
  MinimumAdult = 18,
  MaximumStudent = 25,
}

export enum ServiceProviderSegments {
  PaketaRaiffeisenKlasik = 301,
  PaketaRaiffeisenPartner = 302,
  PaketaRaiffeisenElite = 303,
  RaiffeisenStudent = 305,
  PaketaBazikeMePagese = 327,
  PaketaBazikeFalas = 328,
  IndStandart = 10,
  PunonjesPagamarresPaketaPagaBaze = 158,
  PunonjesitAdministratesPublikePaketaPagaEkstra = 168,
  PunonjesKompanivePrivatePaketaPagaEkstra = 169,
  PaketaRaiffeisenRelaks = 183,
  IndivideStandartePaTaksueshem = 191,
  PunonjesRBAL = 22,
  IndividStandartJoRes = 23,
  PaketaRaiffeisenProgress = 181,
  PaketaRaiffeisenDigi = 277,
}
