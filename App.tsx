import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

type RiskLevel = '保守' | '平衡' | '进取';
type TabKey = 'learn' | 'exam' | 'plan' | 'log';

type LearningTopic = {
  id: string;
  title: string;
  goal: string;
  keyPoints: string[];
};

type ExamQuestion = {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

type InvestmentRecord = {
  id: string;
  date: string;
  amount: string;
  asset: string;
  result: string;
  frequency: string;
  note: string;
};

type StudentAccount = {
  username: string;
  grade: string;
  target: string;
  riskLevel: RiskLevel;
  selectedTopics: string[];
  completedTopics: string[];
  examScores: number[];
  records: InvestmentRecord[];
};

const learningTopics: LearningTopic[] = [
  {
    id: 'risk-return',
    title: '风险与收益基础',
    goal: '理解投资回报与波动的关系，先保证不会“盲目冲动”。',
    keyPoints: ['收益高通常伴随更高波动', '先做风险评估再投资', '本金安全优先于短期暴利']
  },
  {
    id: 'asset-allocation',
    title: '资产配置与分散',
    goal: '知道不同资产作用，避免“全仓单一标的”。',
    keyPoints: ['股票/基金/债券功能不同', '分散投资降低单点风险', '单一标的不超过总预算 30%']
  },
  {
    id: 'compound',
    title: '复利与定投',
    goal: '建立长期主义，学会通过固定节奏积累。',
    keyPoints: ['复利依赖时间', '定投是纪律策略', '上涨下跌都要按计划执行']
  },
  {
    id: 'behavior',
    title: '投资行为与心理',
    goal: '识别追涨杀跌、FOMO 和过度自信。',
    keyPoints: ['决策前写买入理由', '设置止损/止盈规则', '定期复盘比频繁操作更重要']
  },
  {
    id: 'compliance',
    title: '合规与青少年边界',
    goal: '明确未成年人投资应在监护人指导下进行。',
    keyPoints: ['先模拟盘后小额实盘', '遵守平台与法律要求', '避免借贷投资与高杠杆']
  }
];

const examQuestions: ExamQuestion[] = [
  {
    id: 'q1',
    topicId: 'risk-return',
    question: '收益和风险的关系更接近哪种描述？',
    options: ['收益高必然风险低', '收益和风险通常同向变化', '风险高一定亏损', '收益只和运气有关'],
    answerIndex: 1,
    explanation: '大多数资产中，潜在收益越高，波动与不确定性也往往越大。'
  },
  {
    id: 'q2',
    topicId: 'asset-allocation',
    question: '为什么要做资产分散？',
    options: ['为了增加交易次数', '为了降低单一标的风险', '为了追热点', '为了短线暴利'],
    answerIndex: 1,
    explanation: '分散投资的核心目标是降低单个资产波动对整体组合的冲击。'
  },
  {
    id: 'q3',
    topicId: 'compound',
    question: '复利最依赖的因素是？',
    options: ['频繁换标的', '时间和持续投入', '只买最热门资产', '一次性重仓'],
    answerIndex: 1,
    explanation: '复利需要时间沉淀和稳定投入，不是靠短期投机。'
  }
];

const riskTemplates: Record<RiskLevel, string[]> = {
  保守: ['每月预算 300 元以内，80%用于低波动指数或债券类模拟资产', '每周记录一次收益率和波动感受', '每月和家长复盘一次，检查是否超预算'],
  平衡: ['每月预算 500 元以内，60%宽基指数 + 40%稳健资产', '设定 10% 止损纪律并记录触发原因', '每两周做一次资产再平衡练习'],
  进取: ['每月预算 800 元以内，先做模拟仓位训练再小额实操', '单标的不超过总预算 30%，禁止满仓单点押注', '每周写一次“策略是否偏离”的复盘']
};

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;

const createAccount = (username: string, grade: string, target: string, riskLevel: RiskLevel): StudentAccount => ({
  username,
  grade,
  target,
  riskLevel,
  selectedTopics: learningTopics.slice(0, 2).map((topic) => topic.id),
  completedTopics: [],
  examScores: [],
  records: []
});

const buildAiAdvice = (account?: StudentAccount): string => {
  if (!account) {
    return '先创建账号并选择学习目标，我会基于你的学习进度和投资记录持续给建议。';
  }

  const { records, examScores, completedTopics, riskLevel } = account;
  const totalAmount = records.reduce((sum, record) => sum + Number(record.amount || 0), 0);
  const totalResult = records.reduce((sum, record) => sum + Number(record.result || 0), 0);
  const avgScore = examScores.length
    ? examScores.reduce((sum, score) => sum + score, 0) / examScores.length
    : 0;

  const performanceLine =
    records.length === 0
      ? '你还没有投资记录，建议先执行 4 周模拟计划再开始小额实操。'
      : `累计记录 ${records.length} 次，投入约 ¥${totalAmount.toFixed(2)}，阶段盈亏合计 ¥${totalResult.toFixed(2)}。`;

  const studyLine =
    completedTopics.length === 0
      ? '当前学习进度 0%，本周先完成“风险与收益基础”。'
      : `已完成 ${completedTopics.length}/${learningTopics.length} 个学习模块。`;

  const examLine = examScores.length
    ? `测验平均分 ${avgScore.toFixed(1)} 分，建议低于 80 分的模块再练习 1 次。`
    : '还未参加测验，建议先完成一次基础测验。';

  const riskLine = `你的风险偏好为「${riskLevel}」，当前执行建议：${riskTemplates[riskLevel][0]}`;

  return [performanceLine, studyLine, examLine, riskLine, '行动建议：坚持“记录-复盘-微调”循环，每两周更新一次目标。'].join('\n');
};

export default function App() {
  const [accounts, setAccounts] = useState<StudentAccount[]>([]);
  const [activeUsername, setActiveUsername] = useState<string>('');
  const [tab, setTab] = useState<TabKey>('learn');

  const [usernameInput, setUsernameInput] = useState('');
  const [gradeInput, setGradeInput] = useState('');
  const [targetInput, setTargetInput] = useState('6个月掌握定投和风险控制');
  const [riskInput, setRiskInput] = useState<RiskLevel>('平衡');

  const [answers, setAnswers] = useState<Record<string, number>>({});

  const [recordForm, setRecordForm] = useState<InvestmentRecord>({
    id: '',
    date: '',
    amount: '',
    asset: '',
    result: '',
    frequency: '每周',
    note: ''
  });

  const activeAccount = useMemo(
    () => accounts.find((account) => account.username === activeUsername),
    [accounts, activeUsername]
  );

  const updateActiveAccount = (updater: (account: StudentAccount) => StudentAccount) => {
    setAccounts((prev) => prev.map((account) => (account.username === activeUsername ? updater(account) : account)));
  };

  const handleCreateOrLogin = () => {
    const username = usernameInput.trim();
    if (!username) {
      return;
    }

    const existing = accounts.some((account) => account.username === username);
    if (!existing) {
      setAccounts((prev) => [...prev, createAccount(username, gradeInput.trim(), targetInput.trim(), riskInput)]);
    }

    setActiveUsername(username);
    setTab('learn');
  };

  const toggleTopic = (topicId: string) => {
    if (!activeAccount) return;
    updateActiveAccount((account) => {
      const selectedTopics = account.selectedTopics.includes(topicId)
        ? account.selectedTopics.filter((id) => id !== topicId)
        : [...account.selectedTopics, topicId];
      return { ...account, selectedTopics };
    });
  };

  const markTopicComplete = (topicId: string) => {
    if (!activeAccount) return;
    updateActiveAccount((account) => {
      if (account.completedTopics.includes(topicId)) {
        return account;
      }
      return { ...account, completedTopics: [...account.completedTopics, topicId] };
    });
  };

  const submitExam = () => {
    if (!activeAccount) return;
    const score = examQuestions.reduce((sum, question) => {
      return answers[question.id] === question.answerIndex ? sum + Math.floor(100 / examQuestions.length) : sum;
    }, 0);

    updateActiveAccount((account) => ({ ...account, examScores: [score, ...account.examScores] }));
    setAnswers({});
  };

  const addRecord = () => {
    if (!activeAccount) return;
    if (!recordForm.date || !recordForm.amount || !recordForm.asset) return;

    updateActiveAccount((account) => ({
      ...account,
      records: [{ ...recordForm, id: makeId() }, ...account.records]
    }));

    setRecordForm({
      id: '',
      date: '',
      amount: '',
      asset: '',
      result: '',
      frequency: '每周',
      note: ''
    });
  };

  const planList = activeAccount ? riskTemplates[activeAccount.riskLevel] : [];
  const aiAdvice = useMemo(() => buildAiAdvice(activeAccount), [activeAccount]);

  if (!activeAccount) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.card}>
            <Text style={styles.title}>InvestStart 中学生投资学习 App</Text>
            <Text style={styles.subtitle}>支持 Android / iPad，含学习、测验、实操建议和持续记录。</Text>

            <TextInput
              style={styles.input}
              placeholder="账号名（如：xiaoming_8grade）"
              value={usernameInput}
              onChangeText={setUsernameInput}
            />
            <TextInput style={styles.input} placeholder="年级（如：初二）" value={gradeInput} onChangeText={setGradeInput} />
            <TextInput style={styles.input} placeholder="学习目标" value={targetInput} onChangeText={setTargetInput} />

            <Text style={styles.label}>风险偏好</Text>
            <View style={styles.rowWrap}>
              {(['保守', '平衡', '进取'] as RiskLevel[]).map((risk) => (
                <TouchableOpacity
                  key={risk}
                  style={[styles.pill, riskInput === risk && styles.pillActive]}
                  onPress={() => setRiskInput(risk)}
                >
                  <Text style={[styles.pillText, riskInput === risk && styles.pillTextActive]}>{risk}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCreateOrLogin}>
              <Text style={styles.buttonText}>登录 / 创建账号</Text>
            </TouchableOpacity>

            {accounts.length > 0 && (
              <>
                <Text style={styles.label}>已有账号快速切换</Text>
                <View style={styles.rowWrap}>
                  {accounts.map((account) => (
                    <TouchableOpacity
                      key={account.username}
                      style={styles.accountChip}
                      onPress={() => setActiveUsername(account.username)}
                    >
                      <Text style={styles.accountChipText}>{account.username}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.title}>你好，{activeAccount.username}</Text>
        <Text style={styles.subtitle}>目标：{activeAccount.target || '建立投资学习体系'}</Text>

        <View style={styles.tabBar}>
          {[
            { key: 'learn', label: '学习' },
            { key: 'exam', label: '考试' },
            { key: 'plan', label: '计划' },
            { key: 'log', label: '记录' }
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.tabBtn, tab === item.key && styles.tabBtnActive]}
              onPress={() => setTab(item.key as TabKey)}
            >
              <Text style={[styles.tabText, tab === item.key && styles.tabTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'learn' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>1) 学什么：投资知识地图</Text>
            {learningTopics.map((topic) => {
              const selected = activeAccount.selectedTopics.includes(topic.id);
              const completed = activeAccount.completedTopics.includes(topic.id);
              return (
                <View key={topic.id} style={styles.topicCard}>
                  <TouchableOpacity onPress={() => toggleTopic(topic.id)}>
                    <Text style={styles.topicTitle}>{selected ? '✅' : '⬜️'} {topic.title}</Text>
                    <Text style={styles.topicGoal}>{topic.goal}</Text>
                    <Text style={styles.topicPoint}>重点：{topic.keyPoints.join('；')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.minorButton} onPress={() => markTopicComplete(topic.id)}>
                    <Text style={styles.minorButtonText}>{completed ? '已完成' : '标记完成'}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {tab === 'exam' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>2) 怎么检验：模块测验</Text>
            {examQuestions.map((question) => (
              <View key={question.id} style={styles.questionBox}>
                <Text style={styles.questionTitle}>{question.question}</Text>
                {question.options.map((option, index) => {
                  const active = answers[question.id] === index;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.optionBtn, active && styles.optionBtnActive]}
                      onPress={() => setAnswers((prev) => ({ ...prev, [question.id]: index }))}
                    >
                      <Text style={[styles.optionText, active && styles.optionTextActive]}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
                <Text style={styles.hint}>解析：{question.explanation}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={submitExam}>
              <Text style={styles.buttonText}>提交测验</Text>
            </TouchableOpacity>
            <Text style={styles.hint}>历史成绩：{activeAccount.examScores.length ? activeAccount.examScores.join(' / ') : '暂无'}</Text>
          </View>
        )}

        {tab === 'plan' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>3) 如何实操：个性化建议计划</Text>
            <Text style={styles.hint}>风险偏好：{activeAccount.riskLevel}</Text>
            {planList.map((plan, index) => (
              <Text key={plan} style={styles.planItem}>{index + 1}. {plan}</Text>
            ))}
            <Text style={styles.hint}>建议执行节奏：每周记录、双周复盘、月度总结。</Text>
          </View>
        )}

        {tab === 'log' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>4) 持续记录：行为 / 结果 / AI建议</Text>
            <TextInput
              style={styles.input}
              placeholder="日期（2026-03-01）"
              value={recordForm.date}
              onChangeText={(value) => setRecordForm((prev) => ({ ...prev, date: value }))}
            />
            <TextInput
              style={styles.input}
              placeholder="投入金额（元）"
              keyboardType="numeric"
              value={recordForm.amount}
              onChangeText={(value) => setRecordForm((prev) => ({ ...prev, amount: value }))}
            />
            <TextInput
              style={styles.input}
              placeholder="投资标的（如：宽基指数基金）"
              value={recordForm.asset}
              onChangeText={(value) => setRecordForm((prev) => ({ ...prev, asset: value }))}
            />
            <TextInput
              style={styles.input}
              placeholder="本期结果（盈亏金额，可负数）"
              keyboardType="numeric"
              value={recordForm.result}
              onChangeText={(value) => setRecordForm((prev) => ({ ...prev, result: value }))}
            />
            <TextInput
              style={styles.input}
              placeholder="定投频率（每周/每两周/每月）"
              value={recordForm.frequency}
              onChangeText={(value) => setRecordForm((prev) => ({ ...prev, frequency: value }))}
            />
            <TextInput
              style={styles.input}
              placeholder="行为备注（买入理由、是否按计划执行）"
              value={recordForm.note}
              onChangeText={(value) => setRecordForm((prev) => ({ ...prev, note: value }))}
            />

            <TouchableOpacity style={styles.button} onPress={addRecord}>
              <Text style={styles.buttonText}>保存记录</Text>
            </TouchableOpacity>

            <Text style={styles.aiTitle}>AI 总结与建议</Text>
            <Text style={styles.aiBody}>{aiAdvice}</Text>

            {activeAccount.records.map((record) => (
              <View key={record.id} style={styles.recordCard}>
                <Text style={styles.recordText}>{record.date} | ¥{record.amount} | {record.asset}</Text>
                <Text style={styles.recordText}>频率：{record.frequency} | 本期结果：{record.result || '未填'}</Text>
                <Text style={styles.recordText}>备注：{record.note || '无'}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.switchButton} onPress={() => setActiveUsername('')}>
          <Text style={styles.switchButtonText}>切换账号</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fc' },
  page: { padding: 16, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '700', color: '#1e2a47', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#5f6f8f', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9e2f1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#fbfdff'
  },
  label: { marginBottom: 6, color: '#334566', fontWeight: '600' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  pill: {
    borderWidth: 1,
    borderColor: '#9eb0d1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  pillActive: { backgroundColor: '#355ddc', borderColor: '#355ddc' },
  pillText: { color: '#35507f' },
  pillTextActive: { color: '#fff' },
  button: {
    backgroundColor: '#355ddc',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 11,
    marginTop: 4,
    marginBottom: 12
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#263457', marginBottom: 10 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#e9effd',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12
  },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#355ddc' },
  tabText: { color: '#34507d', fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  topicCard: {
    borderWidth: 1,
    borderColor: '#e4ebf8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8
  },
  topicTitle: { color: '#23365f', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  topicGoal: { color: '#4d5e7f', marginBottom: 4 },
  topicPoint: { color: '#5a6b8a', fontSize: 12 },
  minorButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#96aadb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8
  },
  minorButtonText: { color: '#35507d', fontWeight: '600' },
  questionBox: {
    borderWidth: 1,
    borderColor: '#e2e9f7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10
  },
  questionTitle: { color: '#263457', fontWeight: '700', marginBottom: 8 },
  optionBtn: {
    borderWidth: 1,
    borderColor: '#d4def2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6
  },
  optionBtnActive: { backgroundColor: '#355ddc', borderColor: '#355ddc' },
  optionText: { color: '#31486f' },
  optionTextActive: { color: '#fff' },
  hint: { color: '#60708e', marginBottom: 6 },
  planItem: { color: '#334566', marginBottom: 8, lineHeight: 21 },
  aiTitle: { color: '#1f335a', fontWeight: '700', marginBottom: 6 },
  aiBody: { color: '#4a5d81', lineHeight: 20, marginBottom: 8 },
  recordCard: {
    borderTopWidth: 1,
    borderTopColor: '#edf2fb',
    paddingTop: 8,
    marginTop: 6
  },
  recordText: { color: '#3f5073' },
  accountChip: {
    backgroundColor: '#eef3ff',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#cad8f5'
  },
  accountChipText: { color: '#35507d' },
  switchButton: {
    borderWidth: 1,
    borderColor: '#9ab0df',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff'
  },
  switchButtonText: { color: '#35507d', fontWeight: '700' }
});
