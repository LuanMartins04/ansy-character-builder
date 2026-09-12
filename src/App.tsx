import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleUserRound,
  Dices,
  Feather,
  Menu,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Shield,
  Sparkles,
  Swords,
  X,
} from "lucide-react";
import {
  attributes,
  defects,
  qualities,
  races,
  skillDescriptions,
  skillSpecializationRules,
  skills,
} from "./data/catalog";
import { orders } from "./data/orders";
import { grimoire, nephalimGifts } from "./data/grimoire";
import {
  equipment as equipmentCatalog,
  campaignUtilities,
  equipmentWeightBounds,
  magicalEnhancements,
  magicalEquipment,
} from "./data/equipment";
import {
  hunterPowers,
  hunterPowerDetailPrompts,
  hunterPowerVariants,
} from "./data/powers";
import { rangedWeapons, skillProgressions } from "./data/skillProgressions";
import {
  canUseMagic,
  defaultCharacter,
  derived,
  difference,
  encumbrance,
  finalAttribute,
  freeSkillPoints,
  learningPointsUsed,
  maxSkillGraduation,
  orderRequirement,
  qualityRequirement,
  racialBonus,
  remainingXp,
  skillCost,
  skillIncreaseRequirement,
  skillNh,
  skillPointCost,
  skillPointsSpent,
  skillTestNh,
  spentXp,
  supernaturalCost,
  unlockedSupernatural,
  validation,
  weightAffectedSkills,
} from "./engine/rules";
import type { AttributeKey, Character, StepId } from "./types";

const steps: { id: StepId; label: string; kicker: string }[] = [
  { id: "identidade", label: "Identidade", kicker: "Quem é você?" },
  { id: "raca", label: "Raça", kicker: "Sua origem" },
  { id: "atributos", label: "Atributos", kicker: "Corpo e mente" },
  { id: "pericias", label: "Perícias", kicker: "O que aprendeu" },
  { id: "ordem", label: "Ordem", kicker: "Seu caminho" },
  { id: "tracos", label: "Traços", kicker: "Luzes e sombras" },
  { id: "equipamento", label: "Equipamento", kicker: "O que carrega" },
  { id: "sobrenatural", label: "Sobrenatural", kicker: "Além do véu" },
  { id: "resumo", label: "Ficha final", kicker: "Seu personagem" },
];

function loadCharacter(): Character {
  try {
    const saved = localStorage.getItem("ansy-character");
    if (!saved) return defaultCharacter;
    const parsed = JSON.parse(saved);
    return {
      ...defaultCharacter,
      ...parsed,
      orderIds: parsed.orderIds || (parsed.orderId ? [parsed.orderId] : []),
      selectedSkills:
        parsed.selectedSkills ||
        Object.keys(parsed.skills || {}).filter((id) => parsed.skills[id] > 0),
      skillSpecializations: parsed.skillSpecializations || {},
      skillCosts: parsed.skillCosts || {},
      racialAllocation: parsed.racialAllocation || {},
      raceOptions: parsed.raceOptions || {},
      orderAbilityLevels: parsed.orderAbilityLevels || {},
      orderAbilityDetails: parsed.orderAbilityDetails || {},
      traitLevels: parsed.traitLevels || {},
      traitDetails: parsed.traitDetails || {},
      supernaturalDetails: parsed.supernaturalDetails || {},
      magicSphereBySpell: parsed.magicSphereBySpell || {},
      antecedents: {
        ...defaultCharacter.antecedents,
        ...(parsed.antecedents || {}),
      },
    };
  } catch {
    return defaultCharacter;
  }
}

export default function App() {
  const [character, setCharacter] = useState<Character>(loadCharacter);
  const [step, setStep] = useState<StepId>("identidade");
  const [mobileNav, setMobileNav] = useState(false);
  const [saved, setSaved] = useState(false);
  const index = steps.findIndex((s) => s.id === step);
  const xp = remainingXp(character),
    calculated = derived(character),
    issues = validation(character),
    skillReserve = freeSkillPoints(character),
    skillCostBeforeReserve = skillPointsSpent(character),
    skillReserveRemaining = Math.max(0, skillReserve - skillCostBeforeReserve);
  const update = <K extends keyof Character>(key: K, value: Character[K]) =>
    setCharacter((c) => ({ ...c, [key]: value }));
  useEffect(() => {
    localStorage.setItem("ansy-character", JSON.stringify(character));
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 900);
    return () => clearTimeout(t);
  }, [character]);
  useEffect(() => {
    const valid = character.orderAbilities.filter(
      (id) => !orderRequirement(character, id),
    );
    if (valid.length !== character.orderAbilities.length)
      setCharacter((c) => ({ ...c, orderAbilities: valid }));
  }, [
    character.attributes,
    character.skills,
    character.orderAbilities,
    character.raceId,
  ]);
  useEffect(() => {
    if (
      character.orderIds.includes("mago-real") &&
      !character.qualities.includes("distorcer-realidade")
    )
      setCharacter((c) => ({
        ...c,
        orderId: c.orderId === "mago-real" ? null : c.orderId,
        orderIds: c.orderIds.filter((id) => id !== "mago-real"),
        orderAbilities: c.orderAbilities.filter(
          (id) =>
            !orders
              .find((o) => o.id === "mago-real")
              ?.abilities.some((a) => a.id === id),
        ),
      }));
  }, [character.orderIds, character.qualities]);
  const go = (id: StepId) => {
    setStep(id);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const raceNextBlock = (() => {
    const validAttributeIds = new Set<AttributeKey>([
      "porte",
      "forca",
      "agilidade",
      "vigor",
      "inteligencia",
      "percepcao",
    ]);
    if (character.raceId === "tarian") {
      const values = Object.values(character.racialAllocation);
      if (values.length !== 6 || ![1, 2, 3, 4, 5, 6].every((value) => values.includes(value)))
        return "Distribua os seis bônus da Estrutura Tarian antes de continuar.";
    }
    if (
      character.raceId === "nephalim" &&
      (new Set(character.racialChoices).size !== 2 ||
        character.racialChoices.some((choice) => !validAttributeIds.has(choice)))
    )
      return "Escolha dois atributos diferentes para os bônus de Nephalim.";
    if (
      character.raceId === "meio-elfo" &&
      (character.racialChoices.length !== 1 || !validAttributeIds.has(character.racialChoices[0]))
    )
      return "Escolha o atributo que recebe o bônus de Meio-Elfo.";
    if (character.raceId === "anao" && !character.raceOptions.oficio?.trim())
      return "Defina o Ofício favorecido do Anão antes de continuar.";
    if (character.raceId === "anao" && !character.raceOptions.inimigoPredileto?.trim())
      return "Defina o Inimigo predileto do Anão antes de continuar.";
    return null;
  })();
  const next = () => {
      if (step === "raca" && raceNextBlock) return;
      go(steps[Math.min(index + 1, steps.length - 1)].id);
    },
    back = () => go(steps[Math.max(index - 1, 0)].id);
  const reset = () => {
    if (confirm("Recomeçar a ficha e apagar todas as escolhas?")) {
      setCharacter(defaultCharacter);
      go("identidade");
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => go("identidade")}>
          <span className="brand-copy">
            <b>SISTEMA ANSY</b>
            <small>FORJADOR DE FICHAS</small>
          </span>
        </button>
        <div className="top-status">
          <span className={saved ? "save-dot active" : "save-dot"}>
            <Save size={14} />
            {saved ? "Salvo" : "Salvamento automático"}
          </span>
          <button className="icon-button" onClick={reset} title="Recomeçar">
            <RotateCcw size={18} />
          </button>
          <button
            className="icon-button mobile-only"
            onClick={() => setMobileNav(true)}
          >
            <Menu />
          </button>
        </div>
      </header>
      <aside className={mobileNav ? "sidebar open" : "sidebar"}>
        <div className="mobile-nav-head">
          <b>Etapas</b>
          <button className="icon-button" onClick={() => setMobileNav(false)}>
            <X />
          </button>
        </div>
        <div className="progress-caption">
          <span>JORNADA</span>
          <strong>
            {index + 1} de {steps.length}
          </strong>
        </div>
        <div className="progress-track">
          <i style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
        </div>
        <nav>
          {steps.map((s, i) => (
            <button
              key={s.id}
              className={`${step === s.id ? "active " : ""}${i < index ? "done" : ""}`}
              onClick={() => go(s.id)}
            >
              <span className="step-number">
                {i < index ? (
                  <Check size={15} />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <span>
                <small>{s.kicker}</small>
                {s.label}
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
        </nav>
        <div className="sidebar-quote">
          <Feather size={19} />
          <p>“Tudo o que você crê está unido à sua nova base.”</p>
          <small>GUIA BÁSICO ANSY</small>
        </div>
      </aside>
      <main>
        <section className="xp-bar">
          <div>
            <small>ORÇAMENTO</small>
            <strong className={xp < 0 ? "negative" : ""}>{xp}</strong>
            <span>XP disponíveis</span>
          </div>
          <div className="xp-breakdown">
            <span>
              Inicial <b>{character.startingXp}</b>
            </span>
            <span>
              Investido <b>{spentXp(character)}</b>
            </span>
            <span>
              Reserva de perícias <b>{skillReserveRemaining} / {skillReserve}</b>
            </span>
          </div>
          <div className="xp-meter">
            <i
              style={{
                width: `${Math.min(100, Math.max(0, (spentXp(character) / Math.max(1, character.startingXp)) * 100))}%`,
              }}
            />
          </div>
        </section>
        <div className="content">
          {step === "identidade" && (
            <Identity character={character} update={update} />
          )}
          {step === "raca" && <Race character={character} update={update} />}
          {step === "atributos" && (
            <Attributes
              character={character}
              update={update}
              calculated={calculated}
            />
          )}
          {step === "ordem" && <Order character={character} update={update} />}
          {step === "pericias" && (
            <Skills character={character} update={update} />
          )}
          {step === "tracos" && (
            <Traits character={character} update={update} />
          )}
          {step === "equipamento" && (
            <Equipment character={character} update={update} />
          )}
          {step === "sobrenatural" && (
            <Supernatural character={character} update={update} />
          )}
          {step === "resumo" && (
            <Summary
              character={character}
              calculated={calculated}
              issues={issues}
            />
          )}
          <footer className="flow-nav">
            <button
              className="button ghost"
              onClick={back}
              disabled={index === 0}
            >
              <ArrowLeft /> Voltar
            </button>
            <span>
              Etapa {index + 1} de {steps.length}
            </span>
            {step === "raca" && raceNextBlock && (
              <small className="flow-block-reason">{raceNextBlock}</small>
            )}
            {index < steps.length - 1 ? (
              <button
                className="button primary"
                disabled={step === "raca" && !!raceNextBlock}
                title={step === "raca" ? raceNextBlock || undefined : undefined}
                onClick={next}
              >
                Continuar <ArrowRight />
              </button>
            ) : (
              <button className="button primary" onClick={() => window.print()}>
                <BookOpen /> Imprimir ficha
              </button>
            )}
          </footer>
        </div>
      </main>
    </div>
  );
}

function PageHead({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-head">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
type Update = <K extends keyof Character>(key: K, value: Character[K]) => void;

function Identity({
  character,
  update,
}: {
  character: Character;
  update: Update;
}) {
  return (
    <>
      <PageHead
        eyebrow="PASSO 01 — IDENTIDADE"
        title="Toda lenda começa com um nome."
        description="Estabeleça quem era seu personagem antes que a aventura mudasse tudo."
      />
      <div className="panel form-panel">
        <div className="field wide">
          <label>Nome do personagem</label>
          <input
            autoFocus
            value={character.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Ex.: Robert Lincon"
          />
        </div>
        <div className="field">
          <label>Nome do jogador</label>
          <input
            value={character.player}
            onChange={(e) => update("player", e.target.value)}
            placeholder="Seu nome"
          />
        </div>
        <div className="field">
          <label>Idade</label>
          <input
            type="number"
            min="1"
            max="999"
            value={character.age}
            onChange={(e) => update("age", Number(e.target.value))}
          />
          <small>
            {Math.max(0, character.age - 15)} pela experiência de vida +{" "}
            {finalAttribute(character, "inteligencia")} pela Inteligência ={" "}
            {freeSkillPoints(character)} pontos gratuitos para custos de perícia.
            Idade não altera o XP inicial.
          </small>
        </div>
        <div className="field">
          <label>Orçamento inicial de XP</label>
          <div className="xp-picker">
            <input
              aria-label="Quantidade inicial de XP"
              type="number"
              min="50"
              max="80"
              step="1"
              value={character.startingXp}
              onChange={(e) => update("startingXp", Number(e.target.value))}
            />
            <b>XP</b>
          </div>
          <input
            className="xp-slider"
            aria-label="Ajustar orçamento inicial de XP"
            type="range"
            min="50"
            max="80"
            step="1"
            value={Math.max(50, Math.min(80, character.startingXp))}
            onChange={(e) => update("startingXp", Number(e.target.value))}
          />
          <div className="xp-presets" aria-label="Orçamentos sugeridos">
            {[50, 60, 70, 75, 80].map((xp) => (
              <button type="button" className={character.startingXp === xp ? "active" : ""} key={xp} onClick={() => update("startingXp", xp)}>
                {xp}
              </button>
            ))}
          </div>
          <small>
            50–70 XP; 75 ou 80 apenas se o Narrador definir personagens mais
            poderosos.
          </small>
        </div>
        <div className="field wide">
          <label>Conceito</label>
          <textarea
            value={character.concept}
            onChange={(e) => update("concept", e.target.value)}
            placeholder="Pesquisador de história assombrado por sonhos que não compreende..."
            rows={5}
          />
        </div>
      </div>
    </>
  );
}

function Race({ character, update }: { character: Character; update: Update }) {
  const setupRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const shouldRevealContinuation = useRef(false);
  const revealContinuation = () =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        (setupRef.current || nextRef.current)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      ),
    );

  useEffect(() => {
    if (!shouldRevealContinuation.current) return;
    shouldRevealContinuation.current = false;
    revealContinuation();
  }, [character.raceId, character.raceConfirmed]);

  const select = (id: Character["raceId"]) => {
    shouldRevealContinuation.current = true;
    update("raceId", id);
    update("raceConfirmed", true);
    update("racialChoices", []);
    update("racialAllocation", {});
    update("raceOptions", {});
    update("supernaturalChoices", []);
  };
  const choiceLimit =
    character.raceId === "nephalim"
      ? 2
      : character.raceId === "meio-elfo"
        ? 1
        : 0;
  return (
    <>
      <PageHead
        eyebrow="PASSO 02 — RAÇA"
        title="O sangue guarda memórias."
        description="Sua origem altera atributos, desperta habilidades e abre caminhos que outros jamais verão."
      />
      <div className={`choice-grid ${character.raceConfirmed ? "race-confirmed" : ""}`}>
        {(character.raceConfirmed
          ? races.filter((race) => race.id === character.raceId)
          : races
        ).map((r) => (
          <button
            className={`choice-card ${character.raceId === r.id ? "selected" : ""}`}
            onClick={() => !character.raceConfirmed && select(r.id)}
            key={r.id}
          >
            <span className="choice-check">
              {character.raceId === r.id && <Check />}
            </span>
            <small>{r.eyebrow}</small>
            <h2>{r.name}</h2>
            <p>{r.description}</p>
            <ul>
              {r.effects.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            {r.unlocks.length > 0 && (
              <div className="unlocks">
                <Sparkles size={15} />
                <span>Desbloqueia {r.unlocks.join(" e ")}</span>
              </div>
            )}
          </button>
        ))}
      </div>
      {character.raceConfirmed && (
        <button
          className="button ghost race-change-button"
          onClick={() => update("raceConfirmed", false)}
        >
          Trocar raça
        </button>
      )}
      {choiceLimit > 0 && (
        <div className="panel inset" ref={setupRef}>
          <h3>
            {character.raceId === "nephalim"
              ? "Herança celestial"
              : "Herança versátil"}
          </h3>
          <p>
            Escolha{" "}
            {choiceLimit === 2 ? "dois atributos diferentes" : "um atributo"}{" "}
            para receber +1 gratuitamente.
          </p>
          <div className="chip-row">
            {attributes.map((a) => {
              const on = character.racialChoices.includes(a.id);
              return (
                <button
                  disabled={
                    !on && character.racialChoices.length >= choiceLimit
                  }
                  className={on ? "chip active" : "chip"}
                  onClick={() =>
                    update(
                      "racialChoices",
                      on
                        ? character.racialChoices.filter((x) => x !== a.id)
                        : [...character.racialChoices, a.id],
                    )
                  }
                  key={a.id}
                >
                  {on && <Check size={14} />} {a.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {character.raceId === "tarian" && (
        <div className="panel inset" ref={setupRef}>
          <h3>Estrutura Tarian</h3>
          <p>Distribua uma vez cada bônus: +6, +5, +4, +3, +2 e +1.</p>
          <div className="tarian-allocation">
            {attributes.map((a) => (
              <label key={a.id}>
                <span>{a.name}</span>
                <select
                  value={character.racialAllocation[a.id] || ""}
                  onChange={(e) =>
                    update("racialAllocation", {
                      ...character.racialAllocation,
                      [a.id]: Number(e.target.value),
                    })
                  }
                >
                  <option value="">Escolher</option>
                  {[6, 5, 4, 3, 2, 1].map((v) => (
                    <option
                      key={v}
                      disabled={Object.entries(character.racialAllocation).some(
                        ([key, value]) => key !== a.id && value === v,
                      )}
                      value={v}
                    >
                      +{v}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      )}
      {character.raceId === "anao" && (
        <div className="panel inset" ref={setupRef}>
          <h3>Escolhas raciais do Anão</h3>
          <p>
            Engenhos concede +2 em um Ofício. Inimigo Predileto concede +2 em
            testes referentes à raça escolhida e +1 em dano contra ela.
          </p>
          <div className="form-panel race-fields">
            <div className="field">
              <label>Ofício favorecido</label>
              <input
                value={character.raceOptions.oficio || ""}
                onChange={(e) =>
                  update("raceOptions", {
                    ...character.raceOptions,
                    oficio: e.target.value,
                  })
                }
                placeholder="Ex.: Ferreiro"
              />
            </div>
            <div className="field">
              <label>Inimigo predileto</label>
              <input
                value={character.raceOptions.inimigoPredileto || ""}
                onChange={(e) =>
                  update("raceOptions", {
                    ...character.raceOptions,
                    inimigoPredileto: e.target.value,
                  })
                }
                placeholder="Ex.: Orcs"
              />
            </div>
          </div>
        </div>
      )}
      {!["humano", "hunter", "espirito"].includes(character.raceId) && (
        <div className="panel inset">
          <h3>Ciclo de vida</h3>
          <p>
            Os redutores e bônus de atributos por idade da página 154 só são
            confirmados para ciclos semelhantes ao humano. Para outras raças, o
            manual determina adaptação pelo Narrador.
          </p>
          <div className="field">
            <label>Aplicar modificadores etários humanos aos atributos?</label>
            <select
              value={character.raceOptions.ageCycle || "custom"}
              onChange={(e) =>
                update("raceOptions", {
                  ...character.raceOptions,
                  ageCycle: e.target.value,
                })
              }
            >
              <option value="custom">
                Não — ciclo próprio / decisão do Narrador
              </option>
              <option value="human">Sim — ciclo semelhante ao humano</option>
            </select>
          </div>
        </div>
      )}
      <div className="race-next-anchor" ref={nextRef} aria-hidden="true" />
    </>
  );
}

function Attributes({
  character,
  update,
  calculated,
}: {
  character: Character;
  update: Update;
  calculated: ReturnType<typeof derived>;
}) {
  const change = (key: AttributeKey, delta: number) =>
    update("attributes", {
      ...character.attributes,
      [key]: character.attributes[key] + delta,
    });
  return (
    <>
      <PageHead
        eyebrow="PASSO 03 — ATRIBUTOS"
        title="Dê forma ao corpo. E peso à vontade."
        description="A média humana é 10. Cada ponto acima custa 10 XP; cada ponto abaixo devolve 10 XP."
      />
      <div className="attribute-layout">
        <div className="attribute-list">
          {attributes.map((a) => {
            const base = character.attributes[a.id],
              bonus = racialBonus(character, a.id),
              total = finalAttribute(character, a.id),
              diff = difference(total);
            return (
              <article className="attribute-card" key={a.id}>
                <div className="attr-symbol">{a.short}</div>
                <div className="attr-copy">
                  <h3>{a.name}</h3>
                  <p>{a.description}</p>
                  <small>
                    {bonus > 0
                      ? `Base ${base} + ${bonus} racial`
                      : `Diferença ${diff >= 0 ? "+" : ""}${diff}`}
                  </small>
                </div>
                <div className="counter">
                  <button onClick={() => change(a.id, -1)}>
                    <Minus />
                  </button>
                  <strong>{total}</strong>
                  <button onClick={() => change(a.id, 1)}>
                    <Plus />
                  </button>
                </div>
                <div
                  className={
                    base === 10
                      ? "attr-cost"
                      : base > 10
                        ? "attr-cost spend"
                        : "attr-cost gain"
                  }
                >
                  {base === 10
                    ? "0 XP"
                    : base > 10
                      ? `−${(base - 10) * 10} XP`
                      : `+${(10 - base) * 10} XP`}
                </div>
              </article>
            );
          })}
        </div>
        <aside className="derived panel">
          <small>VALORES DERIVADOS</small>
          <h3>A ficha responde</h3>
          <Stat label="Saúde" value={calculated.health.join(" / ")} />
          <Stat label="Fadiga" value={calculated.fatigue} />
          <Stat label="Fé / Determinação" value={calculated.faith} />
          <Stat
            label="Iniciativa"
            value={`${calculated.initiative >= 0 ? "+" : ""}${calculated.initiative}`}
          />
          <Stat label="Renome" value={calculated.renown} />
          <Stat label="Resistência Física" value={calculated.physical} />
          <Stat label="Resistência Mental" value={calculated.mental} />
          <Stat label="Reflexos" value={calculated.reflexes} />
          {calculated.evasiveReflexes !== null && (
            <Stat
              label="Reflexos — alvo de Evasivo"
              value={calculated.evasiveReflexes}
            />
          )}
        </aside>
      </div>
    </>
  );
}
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function Order({
  character,
  update,
}: {
  character: Character;
  update: Update;
}) {
  const active = orders.find((o) => o.id === character.orderId);
  const abilitiesRef = useRef<HTMLDivElement>(null);
  const continuationRef = useRef<HTMLDivElement>(null);
  const shouldRevealContinuation = useRef(false);
  const revealRequirements = () => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        (abilitiesRef.current || continuationRef.current)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      ),
    );
  };
  useEffect(() => {
    if (!shouldRevealContinuation.current) return;
    shouldRevealContinuation.current = false;
    revealRequirements();
  }, [character.orderId, character.orderConfirmed]);
  const choose = (id: string) => {
    shouldRevealContinuation.current = true;
    if (id === "sem-ordem") {
      update("orderId", null);
      update("orderIds", []);
      update("orderAbilities", []);
      update("orderConfirmed", true);
      return;
    }
    const target = orders.find((o) => o.id === id);
    if (
      target?.requirements?.includes("Qualidade Distorcer Realidade") &&
      !character.qualities.includes("distorcer-realidade")
    )
      return;
    const selected = character.orderIds.includes(id);
    if (selected && character.orderId !== id) {
      update("orderId", id);
      update("orderConfirmed", true);
      return;
    }
    if (!selected) update("orderIds", [...character.orderIds, id]);
    update("orderId", id);
    update("orderConfirmed", true);
  };
  const requirement = (id: string) => orderRequirement(character, id);
  const toggleAbility = (id: string) => {
    const on = character.orderAbilities.includes(id);
    if (on)
      update(
        "orderAbilities",
        character.orderAbilities.filter((x) => x !== id),
      );
    else if (!requirement(id)) {
      update("orderAbilities", [...character.orderAbilities, id]);
      update("orderAbilityLevels", {
        ...character.orderAbilityLevels,
        [id]: 1,
      });
    }
  };
  const levelCaps: Record<string, number> = {
    metodo: 2,
    familiar: 3,
    "ligacao-esfera": 5,
    equipe: 4,
    frota: 4,
    "tecnologia-alien": 6,
    adaptado: 6,
    "comunhao-sombras": 2,
    "sentidos-aflorados": 5,
  };
  const detailLabels: Record<string, string> = {
    especialidade: "Tipo de magia",
    "ligacao-esfera": "Esfera escolhida",
    "tecnologia-alien": "Dispositivo escolhido",
    adaptado: "Tipo de dano/ambiente",
  };
  const detailOptions: Record<string, string[]> = {
    metodo: ["Lírico", "Rúnico"],
    "ligacao-esfera": [
      "Água",
      "Ar",
      "Entropia",
      "Espaço/Tempo",
      "Espírito",
      "Fogo",
      "Luz",
      "Matéria",
      "Terra",
      "Vida",
      "Escuridão",
    ],
    "tecnologia-alien": [
      "Acelerador de Movimento",
      "Multiplicador de Saúde",
      "Controle da Massa",
      "Alterar Matéria",
      "Controle Tecnológico",
      "Alterador Estrutural",
    ],
    adaptado: [
      "Fogo/Calor",
      "Frio/Gelo",
      "Ácido",
      "Efeitos Mentais",
      "Eletricidade",
      "Radiação",
    ],
  };
  const details = (id: string) =>
    (character.orderAbilityDetails[id] || "").split("|").filter(Boolean);
  const setDetail = (id: string, index: number, value: string) => {
    const next = details(id);
    next[index] = value;
    update("orderAbilityDetails", {
      ...character.orderAbilityDetails,
      [id]: next.filter(Boolean).join("|"),
    });
  };
  return (
    <>
      <PageHead
        eyebrow="PASSO 05 — ORDEM"
        title="Treinamento deixa marcas."
        description="Ordens representam o caminho que você aprendeu a trilhar. Entrar em uma custa 5 XP."
      />
      <div className={`order-list ${character.orderConfirmed ? "order-confirmed" : ""}`}>
        {(character.orderConfirmed
          ? orders.filter((order) => order.id === (active?.id || "sem-ordem"))
          : orders
        ).map((o) => {
          const selected = character.orderIds.includes(o.id),
            locked =
              o.requirements?.includes("Qualidade Distorcer Realidade") &&
              !character.qualities.includes("distorcer-realidade");
          const position = character.orderIds.indexOf(o.id) + 1;
          return (
            <button
              disabled={locked}
              key={o.id}
              className={`order-row ${selected || (!character.orderIds.length && o.id === "sem-ordem") ? "selected" : ""} ${locked ? "locked" : ""}`}
              onClick={() => !character.orderConfirmed && choose(o.id)}
            >
              <span className="order-icon">
                {locked ? (
                  <Shield />
                ) : o.id.includes("mago") ? (
                  <Sparkles />
                ) : o.id === "atirador" ? (
                  <Dices />
                ) : (
                  <Swords />
                )}
              </span>
              <span>
                <small>
                  {locked
                    ? "EXIGE DISTORCER REALIDADE"
                    : selected
                      ? `${position}ª ORDEM · ${position < 3 ? 5 : (position - 1) * 5} XP`
                      : o.cost
                        ? `${o.cost} XP`
                        : "OPCIONAL"}
                </small>
                <b>{o.name}</b>
                <p>{o.description}</p>
              </span>
              <span className="radio">
                {(selected ||
                  (!character.orderIds.length && o.id === "sem-ordem")) && (
                  <i />
                )}
              </span>
            </button>
          );
        })}
      </div>
      {character.orderConfirmed && (
        <button
          className="button ghost order-change-button"
          onClick={() => update("orderConfirmed", false)}
        >
          Mudar ordem
        </button>
      )}
      {active && active.abilities.length > 0 && (
        <div className="panel inset" ref={abilitiesRef} tabIndex={-1}>
          <h3>Habilidades de {active.name}</h3>
          <p>
            Cada habilidade custa 5 XP. Regras incompletas no próprio manual
            aparecem para conferência, mas não podem ser compradas.
          </p>
          <div className="ability-grid">
            {active.abilities.map((a) => {
              const on = character.orderAbilities.includes(a.id),
                blocked = requirement(a.id);
              return (
                <button
                  disabled={!!blocked}
                  key={a.id}
                  className={`${on ? "ability selected" : "ability"} ${blocked ? "locked" : ""}`}
                  onClick={() => toggleAbility(a.id)}
                >
                  <span>
                    {blocked ? <Shield /> : on ? <Check /> : <Plus />}
                  </span>
                  <div>
                    <b>{a.name}</b>
                    <p>{a.description}</p>
                    {blocked ? (
                      <small>Bloqueada: {blocked}</small>
                    ) : (
                      a.requirements && (
                        <small>
                          Requisito cumprido: {a.requirements.join(", ")}
                        </small>
                      )
                    )}
                    {a.page && <small>Manual, p. {a.page}</small>}
                  </div>
                  <em>{a.status === "incomplete" ? "RASCUNHO" : "5 XP"}</em>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {active &&
        character.orderAbilities.some(
          (id) =>
            active.abilities.find((a) => a.id === id)?.repeatable ||
            detailLabels[id] ||
            detailOptions[id],
        ) && (
          <div className="panel form-panel inset">
            <h3 className="wide">Configuração das habilidades</h3>
            {character.orderAbilities
              .filter(
                (id) =>
                  active.abilities.find((a) => a.id === id)?.repeatable ||
                  detailLabels[id] ||
                  detailOptions[id],
              )
              .map((id) => {
                const ability = active.abilities.find((a) => a.id === id)!,
                  level = character.orderAbilityLevels[id] || 1,
                  choices = detailOptions[id],
                  cap = levelCaps[id];
                return (
                  <div className="field" key={id}>
                    <label>{ability.name}</label>
                    {ability.repeatable &&
                      (cap ? (
                        <select
                          value={level}
                          onChange={(e) =>
                            update("orderAbilityLevels", {
                              ...character.orderAbilityLevels,
                              [id]: Number(e.target.value),
                            })
                          }
                        >
                          {Array.from({ length: cap }, (_, i) => (
                            <option value={i + 1} key={i}>
                              Nível {i + 1} — {(i + 1) * 5} XP
                            </option>
                          ))}
                        </select>
                      ) : (
                        <>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={level}
                            onChange={(e) =>
                              update("orderAbilityLevels", {
                                ...character.orderAbilityLevels,
                                [id]: Math.max(
                                  1,
                                  Math.floor(Number(e.target.value)) || 1,
                                ),
                              })
                            }
                          />
                          <small>
                            5 XP por compra. O manual não publica limite máximo.
                          </small>
                        </>
                      ))}
                    {choices
                      ? Array.from(
                          {
                            length: [
                              "metodo",
                              "tecnologia-alien",
                              "adaptado",
                            ].includes(id)
                              ? level
                              : 1,
                          },
                          (_, index) => (
                            <select
                              aria-label={`${ability.name} — escolha ${index + 1}`}
                              key={index}
                              value={details(id)[index] || ""}
                              onChange={(e) =>
                                setDetail(id, index, e.target.value)
                              }
                            >
                              <option value="">
                                {detailLabels[id] || "Escolha"} {index + 1}
                              </option>
                              {choices.map((option) => (
                                <option
                                  key={option}
                                  disabled={details(id).some(
                                    (chosen, chosenIndex) =>
                                      chosenIndex !== index &&
                                      chosen === option,
                                  )}
                                  value={option}
                                >
                                  {option}
                                </option>
                              ))}
                            </select>
                          ),
                        )
                      : detailLabels[id] && (
                          <input
                            value={character.orderAbilityDetails[id] || ""}
                            onChange={(e) =>
                              update("orderAbilityDetails", {
                                ...character.orderAbilityDetails,
                                [id]: e.target.value,
                              })
                            }
                            placeholder={detailLabels[id]}
                          />
                        )}
                  </div>
                );
              })}
          </div>
        )}
      <div className="order-next-anchor" ref={continuationRef} aria-hidden="true" />
    </>
  );
}

function bestWeaponNh(character: Character) {
  const weapons = character.selectedSkills.filter(
    (id) => id === "armas" || id.startsWith("armas:"),
  );
  return weapons.length
    ? Math.max(...weapons.map((id) => skillNh(character, id, "agilidade")))
    : skillNh(character, "armas", "agilidade");
}

function Skills({
  character,
  update,
}: {
  character: Character;
  update: Update;
}) {
  const total = skillCost(character),
    points = skillPointsSpent(character),
    free = freeSkillPoints(character),
    maximum = maxSkillGraduation(character);
  const [pendingSpecialization, setPendingSpecialization] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState("");
  const [pendingCost, setPendingCost] = useState<number | undefined>();
  const change = (id: string, delta: number) => {
    const cap = id.split(":")[0] === "idioma" ? 3 : maximum;
    update("skills", {
      ...character.skills,
      [id]: Math.max(0, Math.min(cap, (character.skills[id] || 0) + delta)),
    });
  };
  const addSkill = (base: string, specialization?: string, specializedCost?: number) => {
    const repeatable = !!skillSpecializationRules[base];
    const id = repeatable ? `${base}:${Date.now()}` : base;
    update("selectedSkills", [...character.selectedSkills, id]);
    update("skills", { ...character.skills, [id]: 0 });
    const defaultCost = skills.find(([x]) => x === base)?.[3] || 1;
    update("skillCosts", { ...character.skillCosts, [id]: specializedCost || defaultCost });
    if (specialization)
      update("skillSpecializations", {
        ...character.skillSpecializations,
        [id]: specialization,
      });
  };
  const openSpecialization = (base: string) => {
    setPendingSpecialization((current) => (current === base ? null : base));
    setPendingValue("");
    setPendingCost(undefined);
  };
  const addPendingSpecialization = () => {
    if (!pendingSpecialization || !pendingValue.trim()) return;
    addSkill(pendingSpecialization, pendingValue.trim(), pendingCost);
    setPendingSpecialization(null);
    setPendingValue("");
    setPendingCost(undefined);
  };
  const removeSkill = (id: string) => {
    update(
      "selectedSkills",
      character.selectedSkills.filter((x) => x !== id),
    );
    const next = { ...character.skills };
    delete next[id];
    update("skills", next);
    const specs = { ...character.skillSpecializations };
    delete specs[id];
    update("skillSpecializations", specs);
    const costs = { ...character.skillCosts };
    delete costs[id];
    update("skillCosts", costs);
  };
  const available = skills.filter(
    ([id]) =>
      skillSpecializationRules[id] || !character.selectedSkills.includes(id),
  );
  return (
    <>
      <PageHead
        eyebrow="PASSO 04 — PERÍCIAS"
        title="Experiência é aquilo que sobrevive."
        description="Compre graduações. O Nível de Habilidade combina atributo, treinamento e modificadores."
      />
      <div className="skills-summary">
        <span>
          Reserva gratuita usada{" "}
          <b>
            {Math.min(points, free)} / {free}
          </b>
          <small> INT + anos após 15</small>
        </span>
        <span>
          Reserva restante <b>{Math.max(0, free - points)}</b>
          <small> ainda cobre graduações</small>
        </span>
        <span>
          Custo bruto <b>{points} XP</b>
          <small> antes da reserva</small>
        </span>
        <span>
          XP descontado <b>{total}</b>
        </span>
        <span>
          Graduação máxima <b>{maximum}</b>
          <small> idade/4 + [INT]</small>
        </span>
      </div>
      <h2 className="section-title">
        Catálogo de perícias{" "}
        <small>
          Perícias especializadas podem ser adicionadas mais de uma vez
        </small>
      </h2>
      <div className="skill-catalog">
        {available.map(([id, name, attribute, cost]) => {
          const attr = attributes.find((a) => a.id === attribute),
            rule = skillSpecializationRules[id],
            specializationCount = character.selectedSkills.filter(
              (instance) => instance.split(":")[0] === id,
            ).length,
            isOpen = pendingSpecialization === id,
            duplicatePending = character.selectedSkills.some(
              (instance) =>
                instance.split(":")[0] === id &&
                character.skillSpecializations[instance]
                  ?.trim()
                  .toLocaleLowerCase() === pendingValue.trim().toLocaleLowerCase(),
            );
          return (
            <div className={`skill-catalog-entry ${isOpen ? "open" : ""}`} key={id}>
            <button onClick={() => (rule ? openSpecialization(id) : addSkill(id))}>
              <span>
                <small>
                  {attr?.short || "SEM ATRIBUTO"} ·{" "}
                  {cost === 1 ? "FÁCIL" : cost === 2 ? "MÉDIA" : "DIFÍCIL"} ·{" "}
                  {rule
                    ? "CUSTO VARIÁVEL"
                    : `${cost} XP/GRAD.`}
                </small>
                <b>{name}</b>
                <p>{skillDescriptions[id]}</p>
              </span>
              <Plus />
            </button>
            {rule && specializationCount > 0 && (
              <small className="catalog-count">
                {specializationCount} {specializationCount === 1 ? "escolha criada" : "escolhas criadas"}
              </small>
            )}
            {isOpen && rule && (
              <div className="catalog-specialization">
                  <Specialization
                    base={id}
                    rule={rule}
                  value={pendingValue}
                  onChange={(value, newCost) => {
                    setPendingValue(value);
                    setPendingCost(newCost);
                  }}
                />
                {duplicatePending && <small>Essa especialização já foi adicionada.</small>}
                <button
                  className="button primary"
                  disabled={!pendingValue.trim() || duplicatePending}
                  onClick={addPendingSpecialization}
                >
                  Adicionar {name} <Plus />
                </button>
              </div>
            )}
            </div>
          );
        })}
      </div>
      <h2 className="section-title">
        Perícias escolhidas{" "}
        <small>
          Distribua graduações apenas no que seu personagem aprendeu
        </small>
      </h2>
      {character.selectedSkills.length ? (
        <div className="skills-list">
          {character.selectedSkills.map((instance) => {
            const base = instance.split(":")[0],
              def = skills.find(([id]) => id === base);
            if (!def) return null;
            const [, name, attribute, defaultCost] = def,
              grad = character.skills[instance] || 0,
              attr = attributes.find((a) => a.id === attribute),
              rule = skillSpecializationRules[base],
              cost = skillPointCost(character, instance),
              blocked = skillIncreaseRequirement(character, instance),
              baseNh = skillNh(character, instance, attribute),
              testNh = skillTestNh(character, instance, attribute);
            const progression =
              base === "armas"
                ? rangedWeapons.includes(
                    character.skillSpecializations[instance],
                  )
                  ? skillProgressions.armasAlcance
                  : skillProgressions.armasBrancas
                : skillProgressions[base];
            const earned = progression
              ?.filter((x) => grad >= x.at)
              .map((x) => `${x.at}: ${x.benefit}`)
              .join(" · ");
            return (
              <article className="skill-row expanded" key={instance}>
                <div>
                  <small>
                    {attr?.short || "SEM ATRIBUTO"} ·{" "}
                    {cost === 1 ? "FÁCIL" : cost === 2 ? "MÉDIA" : "DIFÍCIL"}
                    {weightAffectedSkills.has(base)
                      ? " · AFETADA POR PESO"
                      : ""}
                  </small>
                  <h3>
                    {name}
                    {character.skillSpecializations[instance]
                      ? `: ${character.skillSpecializations[instance]}`
                      : ""}
                  </h3>
                  <p>{skillDescriptions[base]}</p>
                  {earned && <small>Benefícios ativos — {earned}</small>}
                  {rule && !character.skillSpecializations[instance] && (
                  <Specialization
                    base={base}
                    rule={rule}
                      value={character.skillSpecializations[instance] || ""}
                      onChange={(value, newCost) => {
                        update("skillSpecializations", {
                          ...character.skillSpecializations,
                          [instance]: value,
                        });
                        if (newCost)
                          update("skillCosts", {
                            ...character.skillCosts,
                            [instance]: newCost,
                          });
                      }}
                    />
                  )}
                  <button
                    className="text-button"
                    onClick={() => removeSkill(instance)}
                  >
                    Remover perícia
                  </button>
                </div>
                <div className="nh">
                  <small>
                    {testNh !== baseNh ? "NH / TESTE COM CARGA" : "NH"}
                  </small>
                  <b>{testNh !== baseNh ? `${baseNh} / ${testNh}` : baseNh}</b>
                </div>
                <div className="counter compact">
                  <button onClick={() => change(instance, -1)}>
                    <Minus />
                  </button>
                  <strong>{grad}</strong>
                  <button
                    title={blocked || undefined}
                    disabled={
                      (!!rule && !character.skillSpecializations[instance]) ||
                      !!blocked
                    }
                    onClick={() => change(instance, 1)}
                  >
                    <Plus />
                  </button>
                </div>
                <div className="skill-cost">
                  <b>{cost} XP</b>
                  <small>{blocked || "por graduação"}</small>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-selection">
          Nenhuma perícia escolhida. Escolha uma opção no catálogo acima.
        </div>
      )}
    </>
  );
}

const specializationCategories = {
  armas: {
    label: "Família da arma",
    groups: [
      { name: "Armas brancas", groups: [
        { name: "Leves", options: ["Espada Curta / Punhal", "Faca / Adaga", "Porrete / Cajado"] },
        { name: "Médias", options: ["Espada Longa", "Machado", "Machadinha", "Foice Pequena", "Lança", "Dardo (corpo a corpo)"] },
        { name: "Pesadas", options: ["Espada de Duas Mãos", "Espada Bastarda", "Machado Duplo", "Katana", "Foice Grande"] },
      ] },
      { name: "Arcos, bestas e projéteis", groups: [
        { name: "Arcos e bestas", options: ["Arco Curto", "Arco Longo"] },
        { name: "Arremesso", options: ["Dardo (alcance)", "Funda / Estilingue"] },
      ] },
      { name: "Armas de fogo", groups: [
        { name: "Curtas", options: ["Revólver", "Pistola", "Pistola Laser"] },
        { name: "Médias", options: ["Submetralhadora", "Espingarda"] },
        { name: "Longas", options: ["Metralhadora / Rifle de Assalto", "Rifle Laser", "Rifle Sniper"] },
        { name: "Pesadas / especiais", options: ["Bazuca", "Canhão Laser"] },
      ] },
    ],
  },
  conducao: {
    label: "Categoria de veículo terrestre",
    groups: [
      { name: "Duas rodas", groups: [{ name: "Moto, scooter ou similar", options: [] }] },
      { name: "Leves", groups: [{ name: "Carro, van ou similar", options: [] }] },
      { name: "Pesados", groups: [{ name: "Caminhão, ônibus ou similar", options: [] }] },
      { name: "Especial", groups: [{ name: "Fora de estrada, blindado ou similar", options: [] }] },
    ],
  },
} as const;

function Specialization({
  base,
  rule,
  value,
  onChange,
}: {
  base?: string;
  rule: {
    label: string;
    mode: "text" | "options";
    options?: { name: string; cost?: number }[];
  };
  value: string;
  onChange: (value: string, cost?: number) => void;
}) {
  const categories = base ? specializationCategories[base as keyof typeof specializationCategories] : undefined;
  const [family, setFamily] = useState("");
  const [group, setGroup] = useState("");
  const [vehicle, setVehicle] = useState("");
  const selectedFamily = categories?.groups.find((item) => item.name === family);
  const selectedGroup = selectedFamily?.groups.find((item) => item.name === group);
  if (categories) {
    const finalOptions = selectedGroup?.options || [];
    return (
      <label className="specialization categorized-specialization">
        <span>{categories.label}</span>
        <select value={family} onChange={(e) => { setFamily(e.target.value); setGroup(""); onChange(""); }}>
          <option value="">Escolha a família</option>
          {categories.groups.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>
        {selectedFamily && (
          <select value={group} onChange={(e) => { setGroup(e.target.value); onChange(""); }}>
            <option value="">Escolha a categoria</option>
            {selectedFamily.groups.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
          </select>
        )}
        {selectedGroup && (finalOptions.length ? (
          <select value={value} onChange={(e) => {
            const option = rule.options?.find((item) => item.name === e.target.value);
            onChange(e.target.value, option?.cost);
          }}>
            <option value="">Escolha o modelo</option>
            {finalOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        ) : (
          <input value={vehicle} onChange={(e) => { setVehicle(e.target.value); onChange(`${group}: ${e.target.value}`); }} placeholder="Especifique o veículo" />
        ))}
      </label>
    );
  }
  return (
    <label className="specialization">
      <span>{rule.label}</span>
      {rule.mode === "options" ? (
        <select
          value={value}
          onChange={(e) => {
            const option = rule.options?.find((x) => x.name === e.target.value);
            onChange(e.target.value, option?.cost);
          }}
        >
          <option value="">Selecione…</option>
          {rule.options?.map((x) => (
            <option key={x.name} value={x.name}>
              {x.name}
              {x.cost ? ` — nível ${x.cost}` : ""}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Especifique: ${rule.label.toLowerCase()}`}
        />
      )}
    </label>
  );
}

function Traits({
  character,
  update,
}: {
  character: Character;
  update: Update;
}) {
  const toggle = (key: "qualities" | "defects", id: string) => {
    const on = character[key].includes(id);
    update(
      key,
      on ? character[key].filter((x) => x !== id) : [...character[key], id],
    );
    if (!on) update("traitLevels", { ...character.traitLevels, [id]: 1 });
  };
  const [pec, setPec] = useState("");
  const normalizedPec = pec.trim().toLocaleLowerCase();
  const canAddPeculiarity =
    !!normalizedPec &&
    !character.peculiarities.some(
      (item) => item.trim().toLocaleLowerCase() === normalizedPec,
    );
  const addPeculiarity = () => {
    if (!canAddPeculiarity) return;
    update("peculiarities", [...character.peculiarities, pec.trim()]);
    setPec("");
  };
  const configurable: Record<string, { max?: number; labels?: string[] }> = {
    "visao-agucada": {},
    "faro-agucado": {},
    "audicao-agucada": {},
    "duro-matar": {},
    "vitalidade-extra": {},
    "fadiga-extra": {},
    "poder-oculto": {},
    determinado: {},
    hipoalgia: {},
    "ma-reputacao": {},
    "resistencia-magia": { max: 2, labels: ["+1d (4 XP)", "+2d (8 XP)"] },
    sorte: { max: 2, labels: ["1 vez/sessão (2 XP)", "1 vez/cena (16 XP)"] },
    mediunidade: {
      max: 4,
      labels: [
        "Ouvir/vislumbrar (2 XP)",
        "Ver/conversar (4 XP)",
        "Tocar (8 XP)",
        "Entrar no Umbral (16 XP)",
      ],
    },
    "visao-noturna": {
      max: 2,
      labels: ["Redutor −3 (4 XP)", "Visão perfeita (8 XP)"],
    },
    aliado: {
      max: 6,
      labels: [
        "Indivíduo: mesmo nível ou menor (2 XP)",
        "Indivíduo: até 50% maior (4 XP)",
        "Indivíduo: até 2× maior (8 XP)",
        "Grupo: mesmo nível ou menor (4 XP)",
        "Grupo: até 50% maior (8 XP)",
        "Grupo: até 2× maior (16 XP)",
      ],
    },
  };
  const setLevel = (id: string, value: number) =>
    update("traitLevels", {
      ...character.traitLevels,
      [id]: Math.max(1, Math.floor(value) || 1),
    });
  return (
    <>
      <PageHead
        eyebrow="PASSO 06 — TRAÇOS"
        title="Ninguém é feito apenas de virtudes."
        description="Qualidades consomem XP. Defeitos e peculiaridades devolvem pontos, mas cobram seu preço durante a história."
      />
      <h2 className="section-title">
        Antecedentes <small>Aparência, posição e variantes sociais</small>
      </h2>
      <div className="panel form-panel">
        <div className="field">
          <label>Aparência</label>
          <select
            value={character.antecedents.appearance}
            onChange={(e) =>
              update("antecedents", {
                ...character.antecedents,
                appearance: e.target.value,
              })
            }
          >
            <option value="hediondo">Hediondo (+8 XP, −4 social)</option>
            <option value="muito-feio">Muito Feio (+4 XP, −2 social)</option>
            <option value="feio">Feio (+2 XP, −1 social)</option>
            <option value="normal">Normal</option>
            <option value="atraente">Atraente (2 XP, +1 social)</option>
            <option value="bonito">Bonito (4 XP, +2 social)</option>
            <option value="muito-bonito">Muito Bonito (8 XP, +4 social)</option>
          </select>
        </div>
        <div className="field">
          <label>Recursos / Posição</label>
          <select
            value={character.antecedents.resources}
            onChange={(e) =>
              update("antecedents", {
                ...character.antecedents,
                resources: Number(e.target.value),
              })
            }
          >
            <option value={-2}>Morador de rua (+4 XP)</option>
            <option value={-1}>Pobre (+2 XP)</option>
            <option value={0}>Classe média / Normal</option>
            <option value={1}>Média alta (2 XP)</option>
            <option value={2}>Rico bem-sucedido (4 XP)</option>
            <option value={3}>Político / Senhor feudal (6 XP)</option>
            <option value={4}>Rei / Presidente / Influente (8 XP)</option>
          </select>
        </div>
        <div className="field">
          <label>Alfabetização</label>
          <select
            value={character.antecedents.literacy}
            onChange={(e) =>
              update("antecedents", {
                ...character.antecedents,
                literacy: Number(e.target.value),
              })
            }
          >
            <option value={0}>Padrão do cenário</option>
            <option value={2}>Alfabetizado em cenário raro (2 XP)</option>
            <option value={-2}>
              Analfabeto em cenário alfabetizado (+2 XP)
            </option>
          </select>
        </div>
        <div className="field">
          <label>Renome</label>
          <input
            type="number"
            min="0"
            step="1"
            value={character.antecedents.renown}
            onChange={(e) =>
              update("antecedents", {
                ...character.antecedents,
                renown: Math.max(0, Math.floor(Number(e.target.value)) || 0),
              })
            }
          />
          <small>
            2 XP por nível e +1 em Reconhecimento por nível. O manual não
            publica teto.
          </small>
        </div>
      </div>
      <h2 className="section-title">
        Qualidades <small>Vantagens naturais</small>
      </h2>
      <div className="trait-grid">
        {qualities.map((q) => {
          const on = character.qualities.includes(q.id),
            blocked = !on ? qualityRequirement(character, q.id) : null;
          return (
            <button
              disabled={!!blocked}
              key={q.id}
              onClick={() => toggle("qualities", q.id)}
              className={`${on ? "trait selected" : "trait"} ${blocked ? "locked" : ""}`}
            >
              <span>{blocked ? <Shield /> : on ? <Check /> : <Plus />}</span>
              <div>
                <b>{q.name}</b>
                <p>{q.description}</p>
                {blocked && <small>Bloqueada: {blocked}</small>}
              </div>
              <em>
                −{q.cost} XP{configurable[q.id] ? " / nível" : ""}
              </em>
            </button>
          );
        })}
      </div>
      {character.qualities.some((id) => configurable[id]) && (
        <div className="panel form-panel">
          <h3 className="wide">Níveis e variantes escolhidas</h3>
          {character.qualities
            .filter((id) => configurable[id])
            .map((id) => {
              const q = qualities.find((x) => x.id === id)!,
                cfg = configurable[id];
              return (
                <div className="field" key={id}>
                  <label>{q.name}</label>
                  {cfg.max ? (
                    <select
                      value={character.traitLevels[id] || 1}
                      onChange={(e) => setLevel(id, Number(e.target.value))}
                    >
                      {Array.from({ length: cfg.max }, (_, i) => i + 1).map(
                        (level) => (
                          <option value={level} key={level}>
                            {cfg.labels?.[level - 1] || `Nível ${level}`}
                          </option>
                        ),
                      )}
                    </select>
                  ) : (
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={character.traitLevels[id] || 1}
                      onChange={(e) => setLevel(id, Number(e.target.value))}
                    />
                  )}{" "}
                  {!cfg.max && (
                    <small>O manual não publica nível máximo.</small>
                  )}
                </div>
              );
            })}
        </div>
      )}
      {character.qualities.includes("habilidade-inata") && (
        <div className="panel form-panel">
          <div className="field wide">
            <label>Habilidade inata — perícia que recebe +3</label>
            <select
              value={character.traitDetails["habilidade-inata"] || ""}
              onChange={(e) =>
                update("traitDetails", {
                  ...character.traitDetails,
                  "habilidade-inata": e.target.value,
                })
              }
            >
              <option value="">Escolha a perícia</option>
              {character.selectedSkills.map((instance) => {
                const base = instance.split(":")[0],
                  def = skills.find(([id]) => id === base);
                if (!def) return null;
                const name = def[1],
                  spec = character.skillSpecializations[instance],
                  cost = skillPointCost(character, instance) * 2;
                return (
                  <option key={instance} value={instance}>
                    {name}
                    {spec ? `: ${spec}` : ""} — {cost} XP
                  </option>
                );
              })}
            </select>
            <small>
              O custo é 2/4/6 XP conforme a perícia seja fácil, média ou
              difícil.
            </small>
          </div>
        </div>
      )}
      {character.qualities.includes("ysea") && (
        <div className="panel form-panel">
          <div className="field wide">
            <label>Ysea — atributo +1 do simulacro</label>
            <select
              value={character.traitDetails.ysea || ""}
              onChange={(e) =>
                update("traitDetails", {
                  ...character.traitDetails,
                  ysea: e.target.value,
                })
              }
            >
              <option value="">Escolha o atributo</option>
              {attributes.map((a) => (
                <option value={a.id} key={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <small>
              O bônus existe apenas no simulacro usado em mundos imateriais.
            </small>
          </div>
        </div>
      )}
      <h2 className="section-title">
        Defeitos <small>Concedem experiência</small>
      </h2>
      <div className="trait-grid">
        {defects.map((q) => {
          const incomplete = q.status === "incomplete";
          return (
            <button
              disabled={incomplete}
              key={q.id}
              onClick={() => toggle("defects", q.id)}
              className={`${character.defects.includes(q.id) ? "trait danger selected" : "trait danger"} ${incomplete ? "locked" : ""}`}
            >
              <span>
                {incomplete ? (
                  <Shield />
                ) : character.defects.includes(q.id) ? (
                  <Check />
                ) : (
                  <Plus />
                )}
              </span>
              <div>
                <b>{q.name}</b>
                <p>{q.description}</p>
                {q.page && <small>Manual, p. {q.page}</small>}
              </div>
              <em>
                {incomplete ? "REGRA INCOMPLETA" : `+${Math.abs(q.cost)} XP`}
              </em>
            </button>
          );
        })}
      </div>
      {character.defects.some((id) =>
        ["ma-reputacao", "inimigo", "juramento"].includes(id),
      ) && (
        <div className="panel form-panel">
          {character.defects.includes("ma-reputacao") && (
            <div className="field">
              <label>Má Reputação — níveis</label>
              <input
                type="number"
                min="1"
                step="1"
                value={character.traitLevels["ma-reputacao"] || 1}
                onChange={(e) =>
                  setLevel("ma-reputacao", Number(e.target.value))
                }
              />
              <small>
                +2 XP e +1 em Reconhecimento por nível; −1 em pedidos de
                favores. O manual não publica máximo.
              </small>
            </div>
          )}
          {character.defects.includes("inimigo") && (
            <div className="field">
              <label>Inimigo — gravidade</label>
              <select
                value={character.traitLevels.inimigo || 1}
                onChange={(e) => setLevel("inimigo", Number(e.target.value))}
              >
                <option value={1}>Uma pessoa ou ameaça menor (+2 XP)</option>
                <option value={2}>
                  Várias pessoas ou inimigo muito poderoso (+4 XP)
                </option>
              </select>
            </div>
          )}
          {character.defects.includes("juramento") && (
            <div className="field">
              <label>Juramento — gravidade</label>
              <select
                value={character.traitLevels.juramento || 1}
                onChange={(e) => setLevel("juramento", Number(e.target.value))}
              >
                <option value={1}>Juramento menor (+2 XP)</option>
                <option value={2}>Juramento grave (+4 XP)</option>
              </select>
            </div>
          )}
        </div>
      )}
      {character.defects.some((id) =>
        [
          "inimigo",
          "intolerancia",
          "principio",
          "juramento",
          "dever",
          "protegido",
          "insanidade-leve",
          "insanidade-media",
          "insanidade-grave",
          "doenca-media",
          "doenca-grave",
        ].includes(id),
      ) && (
        <div className="panel form-panel">
          <h3 className="wide">Detalhes obrigatórios dos defeitos</h3>
          {character.defects
            .filter((id) =>
              [
                "inimigo",
                "intolerancia",
                "principio",
                "juramento",
                "dever",
                "protegido",
                "insanidade-leve",
                "insanidade-media",
                "insanidade-grave",
                "doenca-media",
                "doenca-grave",
              ].includes(id),
            )
            .map((id) => {
              const item = defects.find((x) => x.id === id)!;
              return (
                <div className="field" key={id}>
                  <label>{item.name}</label>
                  <input
                    value={character.traitDetails[id] || ""}
                    onChange={(e) =>
                      update("traitDetails", {
                        ...character.traitDetails,
                        [id]: e.target.value,
                      })
                    }
                    placeholder="Defina quem, o quê ou como se manifesta"
                  />
                </div>
              );
            })}
        </div>
      )}
      <div className="panel peculiarity">
        <h3>Peculiaridades</h3>
        <p>
          Hábitos e marcas de interpretação. Cada peculiaridade concede 1 XP.
        </p>
        <div className="add-row">
          <input
            value={pec}
            onChange={(e) => setPec(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addPeculiarity();
            }}
            placeholder="Ex.: ora antes de dormir"
          />
          <button
            className="button primary"
            disabled={!canAddPeculiarity}
            onClick={addPeculiarity}
          >
            <Plus /> Adicionar
          </button>
        </div>
        <div className="chip-row">
          {character.peculiarities.map((p, i) => (
            <button
              className="chip active"
              key={p + i}
              onClick={() =>
                update(
                  "peculiarities",
                  character.peculiarities.filter((_, x) => x !== i),
                )
              }
            >
              {p}
              <X size={13} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function Equipment({
  character,
  update,
}: {
  character: Character;
  update: Update;
}) {
  const all = [...equipmentCatalog, ...campaignUtilities, ...magicalEquipment],
    load = encumbrance(character),
    weightBounds = equipmentWeightBounds(all, character.equipment),
    toggle = (id: string) =>
      update(
        "equipment",
        character.equipment.includes(id)
          ? character.equipment.filter((x) => x !== id)
          : [...character.equipment, id],
      );
  return (
    <>
      <PageHead
        eyebrow="PASSO 07 — EQUIPAMENTO"
        title="Toda ferramenta conta uma história."
        description="Equipamentos publicados e utilidades de campanha. A disponibilidade continua sujeita ao cenário, Recursos, Ordem e autorização do Narrador."
      />
      <div className="lore-callout">
        <b>Regras de armas publicadas</b>
        <p>
          Dano perfurante dobra somente a parcela que ultrapassa a RD; dano
          cortante acrescenta 50% nessa parcela. Arma do mesmo tamanho do
          usuário ou menor recebe +1 NH e +1 dano ao ser usada com duas mãos.
          Arma maior usada com uma mão sofre −1 NH e −1 dano. Armas de fogo a
          até 3 metros acrescentam 50% ao dano.
        </p>
      </div>
      <section className="panel inset">
        <h3>Encantamentos mágicos do manual</h3>
        <p>
          O manual apenas enumera estes encantamentos nas páginas 114–115:
          não há custo, limite ou regra de aquisição publicada. Eles aparecem
          para consulta e não podem ser comprados automaticamente.
        </p>
        <div className="chip-row">
          {magicalEnhancements.map((enhancement) => (
            <span className="chip locked" key={enhancement.name}>
              <Shield size={14} /> {enhancement.name}
            </span>
          ))}
        </div>
      </section>
      <div className="panel form-panel">
        <div className="field">
          <label>Peso total carregado (kg)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={character.carriedWeight}
            onChange={(e) =>
              update("carriedWeight", Math.max(0, Number(e.target.value)))
            }
          />
          <small>
            {weightBounds.hasUnknown
              ? `Há itens sem peso publicado. Os itens com peso conhecido somam entre ${weightBounds.minimum.toLocaleString("pt-BR")} e ${weightBounds.maximum.toLocaleString("pt-BR")} kg.`
              : `Os itens selecionados somam entre ${weightBounds.minimum.toLocaleString("pt-BR")} e ${weightBounds.maximum.toLocaleString("pt-BR")} kg.`}{" "}
            Informe o total real conforme o equipamento.
          </small>
        </div>
        <div className="field">
          <label>Nível de carga</label>
          <strong>{load.level}</strong>
          <small>
            {load.penalty}
            {load.status === "incomplete" ? " · REGRA TRUNCADA NO MANUAL" : ""}
          </small>
        </div>
      </div>
      {[
        "Arma branca",
        "Arma de alcance",
        "Armadura",
        "Escudo",
        "Objeto",
        "Artefato",
      ].map((category) => (
        <section key={category}>
          <h2 className="section-title">
            {category}
            {category === "Artefato" && <small>Concessão exclusiva do Narrador</small>}
          </h2>
          <div className="trait-grid">
            {all
              .filter((x) => x.category === category)
              .map((item) => {
                const on = character.equipment.includes(item.id),
                  narratorOnly = item.category === "Artefato",
                  blocked = narratorOnly || item.status === "incomplete";
                return (
                  <button
                    disabled={blocked}
                    key={item.id}
                    className={`${on ? "trait selected" : "trait"} ${blocked ? "locked" : ""}`}
                    onClick={() => toggle(item.id)}
                  >
                    <span>
                      {blocked ? <Shield /> : on ? <Check /> : <Plus />}
                    </span>
                    <div>
                      <b>{item.name}</b>
                      <p>
                        {[
                          item.complexity,
                          item.damage && `Dano ${item.damage}`,
                          item.rd && `RD/Efeito ${item.rd}`,
                          item.size,
                          item.weight && `${item.weight} kg`,
                          item.weightRange,
                          item.notes,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {blocked && <small>{narratorOnly ? "Artefato bloqueado — somente o Narrador pode conceder." : "Dados incompletos no manual."}</small>}
                    </div>
                  </button>
                );
              })}
          </div>
        </section>
      ))}
    </>
  );
}

function Supernatural({
  character,
  update,
}: {
  character: Character;
  update: Update;
}) {
  const unlocked = unlockedSupernatural(character);
  const racialPool = ["nephalim", "tarian", "karinzed"].includes(
    character.raceId,
  );
  const learningCapacity =
    character.raceId === "karinzed"
      ? Math.max(1, difference(finalAttribute(character, "porte")))
      : racialPool
        ? finalAttribute(character, "porte") +
          Math.ceil(finalAttribute(character, "inteligencia") / 2)
        : null;
  const sphereRanks = character.selectedSkills.reduce<Record<string, number>>(
    (all, id) => {
      if (id.startsWith("esfera:") && character.skillSpecializations[id])
        all[character.skillSpecializations[id]] = character.skills[id] || 0;
      return all;
    },
    {},
  );
  const divineAccess = character.qualities.includes("fe-verdadeira");
  const magicAccess =
    character.orderIds.includes("mago-invocador") ||
    canUseMagic(character) ||
    divineAccess ||
    character.orderAbilities.includes("rituais-shaman") ||
    character.orderAbilities.includes("invocacao-arcana-bardo") ||
    character.orderAbilities.includes("elementos-shinobi");
  const usesSpheres =
    character.orderIds.includes("mago-invocador") ||
    character.raceId === "espirito";
  const magicSource =
    character.raceId === "nephalim"
      ? usesSpheres
        ? Array.from(
            new Map(
              [...nephalimGifts, ...grimoire].map((m) => [m.id, m]),
            ).values(),
          )
        : nephalimGifts
      : divineAccess
        ? grimoire.filter((m) => m.methods?.includes("Oração"))
        : grimoire;
  const magicCards = magicSource.map((m) => ({
    ...m,
    cost: m.level,
    description: [
      m.description,
      `Esferas: ${m.spheres.join(", ")}`,
      m.methods?.length && `Métodos: ${m.methods.join(", ")}`,
      m.faithCost && `Fé: ${m.faithCost}`,
      m.castingTime && `Tempo: ${m.castingTime}`,
      m.duration && `Duração: ${m.duration}`,
      m.range && `Alcance: ${m.range}`,
      m.status === "incomplete" &&
        "Campos operacionais ausentes no manual; seleção bloqueada.",
    ]
      .filter(Boolean)
      .join(" · "),
  }));
  const catalog =
    character.raceId === "hunter"
      ? hunterPowers
      : racialPool || magicAccess
        ? magicCards
        : [];
  const learningUsed = racialPool ? learningPointsUsed(character) : 0;
  const sphereUsed = (sphere: string) =>
    character.supernaturalChoices.reduce(
      (sum, id) =>
        character.magicSphereBySpell[id] === sphere
          ? sum + (grimoire.find((m) => m.id === id)?.level || 0)
          : sum,
      0,
    );
  const title =
    character.raceId === "hunter"
      ? "Limites de Hunter"
      : character.raceId === "nephalim"
        ? "Dons Celestiais / Aprendizados de Luz"
        : character.raceId === "tarian"
          ? "Aprendizados"
          : character.raceId === "karinzed"
            ? "Marcas (Mimetismo Sobrenatural)"
            : character.orderAbilities.includes("rituais-shaman")
              ? "Rituais conhecidos"
              : "Magias conhecidas";
  const availableSpheres = (id: string) => {
    if (!usesSpheres) return [];
    const magic = grimoire.find((m) => m.id === id);
    return (
      magic?.spheres.filter((s) => (sphereRanks[s] || 0) >= magic.level) || []
    );
  };
  const blockReason = (item: (typeof catalog)[number]) => {
    if (item.status === "incomplete") return "Regra incompleta no manual";
    if (character.raceId === "espirito" && !canUseMagic(character))
      return "Comunhão com Spiritum exige Porte e Inteligência acima de 12";
    if (
      learningCapacity &&
      !(
        character.raceId === "nephalim" &&
        usesSpheres &&
        !nephalimGifts.some((gift) => gift.id === item.id)
      ) &&
      learningUsed + item.cost > learningCapacity
    )
      return "Capacidade racial insuficiente";
    if (usesSpheres && availableSpheres(item.id).length === 0)
      return "Exige graduação suficiente em uma Esfera desta magia";
    return null;
  };
  const toggle = (id: string) => {
    const on = character.supernaturalChoices.includes(id),
      item = catalog.find((x) => x.id === id);
    if (!on && item && blockReason(item)) return;
    update(
      "supernaturalChoices",
      on
        ? character.supernaturalChoices.filter((x) => x !== id)
        : [...character.supernaturalChoices, id],
    );
    if (!on && hunterPowerVariants[id] && !character.supernaturalDetails[id])
      update("supernaturalDetails", {
        ...character.supernaturalDetails,
        [id]: hunterPowerVariants[id][0].id,
      });
    if (on) {
      const next = { ...character.magicSphereBySpell };
      delete next[id];
      update("magicSphereBySpell", next);
    }
  };
  return (
    <>
      <PageHead
        eyebrow="PASSO 08 — SOBRENATURAL"
        title={
          unlocked.length
            ? "O véu já não pode escondê-lo."
            : "O véu permanece fechado."
        }
        description={
          unlocked.length
            ? "Escolhas raciais, de Ordem e de perícia determinam exatamente o que está disponível."
            : "Este personagem ainda não possui uma fonte sobrenatural."
        }
      />
      {usesSpheres && (
        <div className="lore-callout">
          <b>Magia por Esferas</b>
          <p>
            Cada graduação na Esfera fornece 1 ponto para aprender magias
            daquele caminho; magia Simples, Média ou Complexa usa
            respectivamente 1, 2 ou 3 pontos. Para resistências, o invocador usa
            2d6 + Diferença de Porte + nível da magia.
          </p>
        </div>
      )}
      {divineAccess && (
        <div className="lore-callout">
          <b>Invocação divina</b>
          <p>
            As orações são preparadas a cada 24 horas. O teste é 2d6 + Fé atual
            contra a própria Resistência Mental + nível da magia. Com sucesso ou
            falha, perde Fé igual ao nível; restrições e penitências dependem da
            entidade patrona.
          </p>
        </div>
      )}
      {["nephalim", "tarian"].includes(character.raceId) && (
        <div className="lore-callout">
          <b>Aprendizados raciais</b>
          <p>
            A capacidade é Porte + metade da Inteligência, arredondada para
            cima. Cada magia custa seu nível. Aprendizados com Tempo “Padrão”
            tornam-se instantâneos; os demais conservam o tempo publicado e
            continuam sendo magia invocada.
          </p>
        </div>
      )}
      {character.raceId === "karinzed" && (
        <div className="lore-callout">
          <b>Mimetismo Sobrenatural — Marcas</b>
          <p>
            Com uma ação de movimento, copia uma habilidade mágica observada ou
            sentida pelo toque. A capacidade é 1 ponto por Diferença de Porte,
            mínimo 1. Após 400 dias terrestres, a Marca torna-se natural e deixa
            espaço para copiar outra.
          </p>
        </div>
      )}
      {(character.orderAbilities.includes("invocacao-arcana-bardo") ||
        character.orderAbilities.includes("elementos-shinobi")) && (
        <div className="lore-callout">
          <b>Aprendizado por treinamento</b>
          <p>
            Magias Simples, Médias e Complexas custam 5, 10 e 15 XP. Jutsus
            modificados podem custar 20 ou 25 XP, mas exigem definição e
            autorização do Narrador.
          </p>
        </div>
      )}
      {unlocked.length === 0 ? (
        <div className="locked-state">
          <span>
            <Shield />
          </span>
          <h2>Nenhuma fonte sobrenatural</h2>
          <p>Um humano comum não recebe magia automaticamente.</p>
        </div>
      ) : (
        <>
          <div className="source-grid">
            {unlocked.map((u, i) => (
              <article key={u}>
                <Sparkles />
                <small>FONTE {String(i + 1).padStart(2, "0")}</small>
                <b>{u}</b>
              </article>
            ))}
          </div>
          {character.raceId === "hunter" && (
            <div className="lore-callout">
              <b>Convicção</b>
              <p>
                Por 1 Fé, durante uma cena torna-se imune a poderes
                sobrenaturais malignos/desumanos, soma metade da Fé contra danos
                sobrenaturais e distingue humanos de não humanos. Quando uma
                criatura desumana resiste a um Limite, a dificuldade é 2 × Porte
                do Hunter + nível do Limite; humanos e Hunters resistem apenas
                contra o Porte normal.
              </p>
            </div>
          )}
          {character.raceId === "hunter" && (
            <div className="lore-callout">
              <b>Gatilhos, descritores e modificadores</b>
              <p>
                O Narrador define o gatilho inicial e o descritor de cada
                Limite. “Inato” é listado como vantagem por −3 pontos, embora o
                texto diga que vantagens custam XP; “Dependência” aparece sem
                custo ou regra. Por isso nenhum dos dois altera automaticamente
                o orçamento.
              </p>
            </div>
          )}
          {character.raceId === "uh-nura" && (
            <div className="lore-callout">
              <b>Habilidades naturais de Uh-Nura</b>
              <p>
                Modo Invisível permite passar despercebido quando desejar. Ao
                tocar alguém, Conexão Mental acessa passado e sentimentos —
                Convicção de um Hunter pode anulá-la. Toque Espectral é acionado
                sem gastar Fé, mas torna o Uh-Nura visível para seres de
                Spiritum ao acertar o alvo. São habilidades raciais automáticas,
                não compras do Grimório.
              </p>
            </div>
          )}
          {character.raceId === "nephalim" && (
            <div className="lore-callout">
              <b>Milagre & Inimigo do Mal</b>
              <p>
                Milagre concede um crítico por cena sem finalidade maligna.
                Contra malignos, soma ao teste e à RD sua Diferença de Porte
                (mínimo +1); Trevas causam dano dobrado.
              </p>
            </div>
          )}
          {character.raceId === "changelin" && (
            <div className="lore-callout">
              <b>Essência Mágica, Glamour e Paradísia</b>
              <p>
                Changelins não gastam Fé ao usar magia e morrem na próxima ação
                em uma área sem Mana. O manual não informa como adquirem magias,
                por isso o Grimório não é liberado automaticamente. Glamour
                possui uma contradição na fonte: a p. 148 fala em mudança no
                início da primavera, enquanto a p. 149 permite mudar a forma a
                cada 6 horas. Caminho para Paradísia exige concentração por uma
                ação.
              </p>
            </div>
          )}
          {character.raceId === "kahje" && (
            <div className="lore-callout">
              <b>Dever Existencial</b>
              <p>
                Kahje podem realizar efeitos como Magos Criacionistas, mas a
                página 141 não publica uma forma de comprar esses efeitos. Por
                isso o app registra a habilidade racial e não libera magias
                gratuitas. Ingenuidade aplica −10 apenas à Resistência Mental
                contra Persuadir; Kahje não podem tirar a vida de seres.
              </p>
            </div>
          )}
          {catalog.length > 0 && (
            <>
              <div className="section-title">
                <span>
                  <h2>{title}</h2>
                  <small>
                    {learningCapacity
                      ? `Capacidade racial ${learningUsed}/${learningCapacity}`
                      : "Itens incompletos permanecem visíveis, porém bloqueados"}
                  </small>
                </span>
                <b>
                  {character.raceId === "hunter"
                    ? `${supernaturalCost(character)} XP`
                    : ""}
                </b>
              </div>
              <div className="trait-grid supernatural-list">
                {catalog.map((item) => {
                  const on = character.supernaturalChoices.includes(item.id),
                    reason = !on ? blockReason(item) : null,
                    spheres = availableSpheres(item.id),
                    isRacialGift = nephalimGifts.some(
                      (gift) => gift.id === item.id,
                    ),
                    canUseSphere =
                      on &&
                      character.raceId !== "hunter" &&
                      spheres.length > 0 &&
                      (!racialPool ||
                        (character.raceId === "nephalim" && usesSpheres));
                  return (
                    <article
                      className={`${on ? "trait selected" : "trait"} ${reason ? "locked" : ""}`}
                      key={item.id}
                    >
                      <button
                        disabled={!!reason}
                        onClick={() => toggle(item.id)}
                      >
                        <span>
                          {reason ? <Shield /> : on ? <Check /> : <Plus />}
                        </span>
                        <div>
                          <b>{item.name}</b>
                          <p>{item.description}</p>
                          {reason && <small>Bloqueado: {reason}</small>}
                          {item.page && <small>Manual, p. {item.page}</small>}
                        </div>
                        <em>
                          {item.cost}{" "}
                          {character.raceId === "hunter" ? "XP" : "pts"}
                        </em>
                      </button>
                      {canUseSphere && (
                        <label className="specialization">
                          <span>
                            {isRacialGift
                              ? "Esfera usada (opcional para Dom racial)"
                              : "Esfera usada"}
                          </span>
                          <select
                            value={character.magicSphereBySpell[item.id] || ""}
                            onChange={(e) =>
                              update("magicSphereBySpell", {
                                ...character.magicSphereBySpell,
                                [item.id]: e.target.value,
                              })
                            }
                          >
                            {isRacialGift && (
                              <option value="">Usar como Dom racial</option>
                            )}
                            {!isRacialGift && (
                              <option value="">Escolha a Esfera</option>
                            )}
                            {spheres.map((s) => (
                              <option
                                disabled={
                                  sphereUsed(s) + item.cost >
                                  (sphereRanks[s] || 0)
                                }
                                key={s}
                              >
                                {s} — {sphereUsed(s)}/{sphereRanks[s]}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
          {character.raceId === "hunter" &&
            character.supernaturalChoices.some(
              (id) => hunterPowerVariants[id],
            ) && (
              <div className="panel form-panel">
                <h3 className="wide">Níveis e variantes dos Limites</h3>
                {character.supernaturalChoices
                  .filter((id) => hunterPowerVariants[id])
                  .map((id) => (
                    <div className="field" key={id}>
                      <label>
                        {hunterPowers.find((x) => x.id === id)?.name}
                      </label>
                      <select
                        value={
                          character.supernaturalDetails[id] ||
                          hunterPowerVariants[id][0].id
                        }
                        onChange={(e) =>
                          update("supernaturalDetails", {
                            ...character.supernaturalDetails,
                            [id]: e.target.value,
                          })
                        }
                      >
                        {hunterPowerVariants[id].map((v) => (
                          <option value={v.id} key={v.id}>
                            {v.label} — {v.cost} XP
                          </option>
                        ))}
                      </select>
                      <small>
                        {
                          hunterPowerVariants[id].find(
                            (v) =>
                              v.id ===
                              (character.supernaturalDetails[id] ||
                                hunterPowerVariants[id][0].id),
                          )?.description
                        }
                      </small>
                    </div>
                  ))}
              </div>
            )}
          {character.raceId === "hunter" &&
            character.supernaturalChoices.some(
              (id) => hunterPowerDetailPrompts[id],
            ) && (
              <div className="panel form-panel">
                <h3 className="wide">Definições obrigatórias dos Limites</h3>
                {character.supernaturalChoices
                  .filter((id) => hunterPowerDetailPrompts[id])
                  .map((id) => (
                    <div className="field wide" key={id}>
                      <label>
                        {hunterPowers.find((x) => x.id === id)?.name}
                      </label>
                      <input
                        value={character.supernaturalDetails[id] || ""}
                        onChange={(e) =>
                          update("supernaturalDetails", {
                            ...character.supernaturalDetails,
                            [id]: e.target.value,
                          })
                        }
                        placeholder={hunterPowerDetailPrompts[id]}
                      />
                      <small>{hunterPowerDetailPrompts[id]}</small>
                    </div>
                  ))}
              </div>
            )}
        </>
      )}
    </>
  );
}

function Summary({
  character,
  calculated,
  issues,
}: {
  character: Character;
  calculated: ReturnType<typeof derived>;
  issues: string[];
}) {
  const race = races.find((r) => r.id === character.raceId)!;
  const selectedOrders = orders.filter((o) =>
    character.orderIds.includes(o.id),
  );
  const learned = character.selectedSkills.filter(
    (id) => (character.skills[id] || 0) > 0,
  );
  const allEquipment = [...equipmentCatalog, ...campaignUtilities, ...magicalEquipment];
  const chosenEquipment = allEquipment.filter((x) =>
    character.equipment.includes(x.id),
  );
  const load = encumbrance(character);
  const supernatural = [...hunterPowers, ...grimoire, ...nephalimGifts].filter(
    (item, index, all) =>
      character.supernaturalChoices.includes(item.id) &&
      all.findIndex((x) => x.id === item.id) === index,
  );
  const abilityNames = selectedOrders.flatMap((order) =>
    order.abilities
      .filter((a) => character.orderAbilities.includes(a.id))
      .map(
        (a) =>
          `${a.name}${(character.orderAbilityLevels[a.id] || 1) > 1 ? ` (nível ${character.orderAbilityLevels[a.id]})` : ""}${character.orderAbilityDetails[a.id] ? `: ${character.orderAbilityDetails[a.id].replaceAll("|", ", ")}` : ""}`,
      ),
  );
  return (
    <>
      <PageHead
        eyebrow="PASSO 08 — FICHA FINAL"
        title={character.name || "Personagem sem nome"}
        description={
          character.concept ||
          "A história ainda não foi escrita, mas o caminho já começou."
        }
      />
      {issues.length > 0 && (
        <div className="issues">
          <b>Antes de finalizar</b>
          {issues.map((x) => (
            <p key={x}>• {x}</p>
          ))}
        </div>
      )}
      <div className="sheet">
        <header>
          <div className="portrait">
            <CircleUserRound />
          </div>
          <div>
            <small>
              {race.name} ·{" "}
              {selectedOrders.map((o) => o.name).join(" / ") || "Sem Ordem"}
            </small>
            <h2>{character.name || "Sem nome"}</h2>
            <p>
              {character.age} anos{" "}
              {character.player && `· Jogador: ${character.player}`}
            </p>
          </div>
          <div className="sheet-xp">
            <strong>{remainingXp(character)}</strong>
            <small>XP LIVRES</small>
          </div>
        </header>
        <section className="sheet-attributes">
          {attributes.map((a) => (
            <div key={a.id}>
              <small>{a.short}</small>
              <strong>{finalAttribute(character, a.id)}</strong>
              <span>
                {difference(finalAttribute(character, a.id)) >= 0 ? "+" : ""}
                {difference(finalAttribute(character, a.id))}
              </span>
            </div>
          ))}
        </section>
        <div className="sheet-columns">
          <section>
            <h3>Parâmetros</h3>
            <Stat label="Saúde" value={calculated.health.join(" / ")} />
            <Stat label="Fadiga" value={calculated.fatigue} />
            <Stat label="Fé / Determinação" value={calculated.faith} />
            <Stat label="Iniciativa" value={calculated.initiative} />
            <Stat label="Renome" value={calculated.renown} />
            <Stat label="Resistência Física" value={calculated.physical} />
            <Stat label="Resistência Mental" value={calculated.mental} />
            <Stat label="Reflexos" value={calculated.reflexes} />
            {calculated.evasiveReflexes !== null && (
              <Stat
                label="Reflexos — alvo de Evasivo"
                value={calculated.evasiveReflexes}
              />
            )}
          </section>
          <section>
            <h3>Perícias treinadas</h3>
            {learned.length ? (
              learned.map((instance) => {
                const base = instance.split(":")[0],
                  def = skills.find(([id]) => id === base);
                if (!def) return null;
                const [, name, attribute] = def,
                  spec = character.skillSpecializations[instance];
                return (
                  <Stat
                    key={instance}
                    label={`${name}${spec ? `: ${spec}` : ""} (${character.skills[instance]})`}
                    value={`NH ${skillNh(character, instance, attribute)}`}
                  />
                );
              })
            ) : (
              <p className="empty">Nenhuma perícia comprada.</p>
            )}
          </section>
        </div>
        <div className="sheet-columns">
          <section>
            <h3>Características raciais</h3>
            <p>
              {[...race.effects, ...race.unlocks].join(" · ") ||
                "Nenhuma característica racial automática."}
            </p>
            <h3>Antecedentes</h3>
            <p>
              Aparência: {character.antecedents.appearance.replaceAll("-", " ")}{" "}
              · Recursos {character.antecedents.resources} · Alfabetização{" "}
              {character.antecedents.literacy} · Renome{" "}
              {character.antecedents.renown}
            </p>
            <h3>Qualidades</h3>
            <p>
              {qualities
                .filter((q) => character.qualities.includes(q.id))
                .map(
                  (x) =>
                    `${x.name}${character.traitDetails[x.id] ? `: ${character.traitDetails[x.id]}` : ""}`,
                )
                .join(", ") || "Nenhuma"}
            </p>
            <h3>Defeitos</h3>
            <p>
              {defects
                .filter((q) => character.defects.includes(q.id))
                .map(
                  (x) =>
                    `${x.name}${character.traitDetails[x.id] ? `: ${character.traitDetails[x.id]}` : ""}`,
                )
                .join(", ") || "Nenhum"}
            </p>
          </section>
          <section>
            <h3>Habilidades de Ordem</h3>
            <p>{abilityNames.join(", ") || "Nenhuma"}</p>
            <h3>Dons, poderes e magias escolhidos</h3>
            <p>
              {supernatural
                .map(
                  (x) =>
                    `${x.name}${character.magicSphereBySpell[x.id] ? ` [${character.magicSphereBySpell[x.id]}]` : ""}${character.supernaturalDetails[x.id] ? ` — ${hunterPowerVariants[x.id]?.find((v) => v.id === character.supernaturalDetails[x.id])?.label || character.supernaturalDetails[x.id]}` : ""}`,
                )
                .join(", ") || "Nenhum"}
            </p>
            <h3>Equipamento</h3>
            <p>
              {chosenEquipment.map((x) => x.name).join(", ") || "Nenhum"} ·{" "}
              {character.carriedWeight} kg · {load.level}
            </p>
            <h3>Peculiaridades</h3>
            <p>{character.peculiarities.join(", ") || "Nenhuma"}</p>
          </section>
        </div>
      </div>
    </>
  );
}
