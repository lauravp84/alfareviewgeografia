/**
 * Sistema de Armazenamento Local - AlfaReview Geografia
 * Gerencia dados do aluno, progresso e configurações
 */

class StorageManager {
    constructor() {
        this.storageKey = 'alfareview-geografia';
        this.defaultData = {
            student: {
                name: '',
                createdAt: null,
                lastAccess: null
            },
            progress: {
                totalPoints: 0,
                totalMedals: 0,
                completedUnits: 0,
                units: {
                    1: { progress: 0, points: 0, stars: 0, medal: null, completed: false, questionsAnswered: 0, correctAnswers: 0 },
                    2: { progress: 0, points: 0, stars: 0, medal: null, completed: false, questionsAnswered: 0, correctAnswers: 0 },
                    3: { progress: 0, points: 0, stars: 0, medal: null, completed: false, questionsAnswered: 0, correctAnswers: 0 },
                    4: { progress: 0, points: 0, stars: 0, medal: null, completed: false, questionsAnswered: 0, correctAnswers: 0 },
                    5: { progress: 0, points: 0, stars: 0, medal: null, completed: false, questionsAnswered: 0, correctAnswers: 0 },
                    6: { progress: 0, points: 0, stars: 0, medal: null, completed: false, questionsAnswered: 0, correctAnswers: 0 }
                }
            },
            settings: {
                soundEnabled: true,
                animationsEnabled: true,
                theme: 'default'
            },
            achievements: {
                unlockedAccessories: [],
                stitchCustomization: {
                    hat: null,
                    glasses: null,
                    backpack: null
                }
            }
        };
        
        this.init();
    }
    
    /**
     * Inicializa o sistema de armazenamento
     */
    init() {
        if (!this.hasData()) {
            this.saveData(this.defaultData);
        }
        this.updateLastAccess();
    }
    
    /**
     * Verifica se existem dados salvos
     */
    hasData() {
        return localStorage.getItem(this.storageKey) !== null;
    }
    
    /**
     * Carrega todos os dados do localStorage
     */
    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsedData = JSON.parse(data);
                // Merge com dados padrão para garantir compatibilidade
                return this.mergeWithDefaults(parsedData);
            }
            return this.defaultData;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return this.defaultData;
        }
    }
    
    /**
     * Salva dados no localStorage
     */
    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    }
    
    /**
     * Merge dados carregados com estrutura padrão
     */
    mergeWithDefaults(loadedData) {
        const merged = JSON.parse(JSON.stringify(this.defaultData));
        
        // Merge student data
        if (loadedData.student) {
            Object.assign(merged.student, loadedData.student);
        }
        
        // Merge progress data
        if (loadedData.progress) {
            Object.assign(merged.progress, loadedData.progress);
            if (loadedData.progress.units) {
                Object.assign(merged.progress.units, loadedData.progress.units);
            }
        }
        
        // Merge settings
        if (loadedData.settings) {
            Object.assign(merged.settings, loadedData.settings);
        }
        
        // Merge achievements
        if (loadedData.achievements) {
            Object.assign(merged.achievements, loadedData.achievements);
        }
        
        return merged;
    }
    
    /**
     * Atualiza último acesso
     */
    updateLastAccess() {
        const data = this.loadData();
        data.student.lastAccess = new Date().toISOString();
        this.saveData(data);
    }
    
    /**
     * Define nome do aluno
     */
    setStudentName(name) {
        const data = this.loadData();
        data.student.name = name.trim();
        if (!data.student.createdAt) {
            data.student.createdAt = new Date().toISOString();
        }
        return this.saveData(data);
    }
    
    /**
     * Obtém nome do aluno
     */
    getStudentName() {
        const data = this.loadData();
        return data.student.name || '';
    }
    
    /**
     * Atualiza progresso de uma unidade
     */
    updateUnitProgress(unitId, progressData) {
        const data = this.loadData();
        const unit = data.progress.units[unitId];
        
        if (unit) {
            Object.assign(unit, progressData);
            
            // Recalcula totais
            this.recalculateTotals(data);
            
            return this.saveData(data);
        }
        return false;
    }
    
    /**
     * Obtém progresso de uma unidade
     */
    getUnitProgress(unitId) {
        const data = this.loadData();
        return data.progress.units[unitId] || this.defaultData.progress.units[unitId];
    }
    
    /**
     * Adiciona pontos a uma unidade
     */
    addPoints(unitId, points) {
        const data = this.loadData();
        const unit = data.progress.units[unitId];
        
        if (unit) {
            unit.points += points;
            this.recalculateTotals(data);
            return this.saveData(data);
        }
        return false;
    }
    
    /**
     * Define medalha de uma unidade
     */
    setUnitMedal(unitId, medal) {
        const data = this.loadData();
        const unit = data.progress.units[unitId];
        
        if (unit) {
            unit.medal = medal;
            this.recalculateTotals(data);
            return this.saveData(data);
        }
        return false;
    }
    
    /**
     * Define estrelas de uma unidade
     */
    setUnitStars(unitId, stars) {
        const data = this.loadData();
        const unit = data.progress.units[unitId];
        
        if (unit) {
            unit.stars = Math.max(0, Math.min(3, stars));
            return this.saveData(data);
        }
        return false;
    }
    
    /**
     * Recalcula totais baseado nos dados das unidades
     */
    recalculateTotals(data) {
        let totalPoints = 0;
        let totalMedals = 0;
        let completedUnits = 0;
        
        Object.values(data.progress.units).forEach(unit => {
            totalPoints += unit.points || 0;
            if (unit.medal) totalMedals++;
            if (unit.completed) completedUnits++;
        });
        
        data.progress.totalPoints = totalPoints;
        data.progress.totalMedals = totalMedals;
        data.progress.completedUnits = completedUnits;
    }
    
    /**
     * Obtém progresso geral
     */
    getOverallProgress() {
        const data = this.loadData();
        return {
            totalPoints: data.progress.totalPoints,
            totalMedals: data.progress.totalMedals,
            completedUnits: data.progress.completedUnits,
            totalUnits: 6
        };
    }
    
    /**
     * Adiciona acessório desbloqueado
     */
    unlockAccessory(accessory) {
        const data = this.loadData();
        if (!data.achievements.unlockedAccessories.includes(accessory)) {
            data.achievements.unlockedAccessories.push(accessory);
            return this.saveData(data);
        }
        return false;
    }
    
    /**
     * Define customização do Stitch
     */
    setStitchCustomization(type, item) {
        const data = this.loadData();
        if (data.achievements.stitchCustomization.hasOwnProperty(type)) {
            data.achievements.stitchCustomization[type] = item;
            return this.saveData(data);
        }
        return false;
    }
    
    /**
     * Obtém customização do Stitch
     */
    getStitchCustomization() {
        const data = this.loadData();
        return data.achievements.stitchCustomization;
    }
    
    /**
     * Exporta dados para JSON
     */
    exportData() {
        const data = this.loadData();
        const exportData = {
            ...data,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `alfareview-geografia-${data.student.name || 'progresso'}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Importa dados de arquivo JSON
     */
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Validação básica
                    if (!importedData.student || !importedData.progress) {
                        reject(new Error('Arquivo inválido: estrutura de dados incorreta'));
                        return;
                    }
                    
                    // Merge com dados padrão
                    const mergedData = this.mergeWithDefaults(importedData);
                    
                    // Salva dados importados
                    if (this.saveData(mergedData)) {
                        resolve(mergedData);
                    } else {
                        reject(new Error('Erro ao salvar dados importados'));
                    }
                } catch (error) {
                    reject(new Error('Erro ao processar arquivo: ' + error.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Erro ao ler arquivo'));
            };
            
            reader.readAsText(file);
        });
    }
    
    /**
     * Limpa todos os dados (reset)
     */
    clearData() {
        try {
            localStorage.removeItem(this.storageKey);
            this.init();
            return true;
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            return false;
        }
    }
    
    /**
     * Obtém configurações
     */
    getSettings() {
        const data = this.loadData();
        return data.settings;
    }
    
    /**
     * Atualiza configurações
     */
    updateSettings(newSettings) {
        const data = this.loadData();
        Object.assign(data.settings, newSettings);
        return this.saveData(data);
    }
    
    /**
     * Obtém estatísticas detalhadas
     */
    getDetailedStats() {
        const data = this.loadData();
        const stats = {
            student: data.student,
            overall: this.getOverallProgress(),
            units: {},
            achievements: data.achievements
        };
        
        // Estatísticas por unidade
        Object.entries(data.progress.units).forEach(([unitId, unit]) => {
            stats.units[unitId] = {
                ...unit,
                accuracy: unit.questionsAnswered > 0 ? 
                    Math.round((unit.correctAnswers / unit.questionsAnswered) * 100) : 0
            };
        });
        
        return stats;
    }
}

// Instância global do gerenciador de armazenamento
window.storageManager = new StorageManager();


    /**
     * Exporta dados para backup
     */
    exportData() {
        try {
            const data = this.loadData();
            const exportData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                studentName: data.studentName,
                progress: data.progress,
                achievements: data.achievements,
                statistics: this.getDetailedStatistics()
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `alfareview_backup_${data.studentName}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            return true;
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            return false;
        }
    }
    
    /**
     * Importa dados de backup
     */
    importData(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('Nenhum arquivo selecionado'));
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Valida estrutura dos dados
                    if (!this.validateImportData(importedData)) {
                        reject(new Error('Arquivo de backup inválido'));
                        return;
                    }
                    
                    // Faz backup dos dados atuais
                    const currentData = this.loadData();
                    localStorage.setItem(this.backupKey, JSON.stringify(currentData));
                    
                    // Importa novos dados
                    const newData = {
                        studentName: importedData.studentName,
                        progress: importedData.progress,
                        achievements: importedData.achievements,
                        lastAccess: new Date().toISOString()
                    };
                    
                    localStorage.setItem(this.storageKey, JSON.stringify(newData));
                    
                    resolve({
                        success: true,
                        studentName: importedData.studentName,
                        importDate: importedData.timestamp
                    });
                    
                } catch (error) {
                    reject(new Error('Erro ao processar arquivo: ' + error.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Erro ao ler arquivo'));
            };
            
            reader.readAsText(file);
        });
    }
    
    /**
     * Valida dados de importação
     */
    validateImportData(data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.version || !data.studentName) return false;
        if (!data.progress || typeof data.progress !== 'object') return false;
        if (!data.achievements || typeof data.achievements !== 'object') return false;
        
        // Valida estrutura do progresso
        if (!data.progress.units || typeof data.progress.units !== 'object') return false;
        if (typeof data.progress.overall !== 'object') return false;
        
        return true;
    }
    
    /**
     * Restaura backup anterior
     */
    restoreBackup() {
        try {
            const backupData = localStorage.getItem(this.backupKey);
            if (!backupData) {
                return { success: false, message: 'Nenhum backup encontrado' };
            }
            
            const data = JSON.parse(backupData);
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            localStorage.removeItem(this.backupKey);
            
            return { success: true, message: 'Backup restaurado com sucesso' };
        } catch (error) {
            console.error('Erro ao restaurar backup:', error);
            return { success: false, message: 'Erro ao restaurar backup' };
        }
    }
    
    /**
     * Obtém estatísticas detalhadas
     */
    getDetailedStatistics() {
        const data = this.loadData();
        const stats = {
            totalTimeSpent: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            averageAccuracy: 0,
            unitsCompleted: 0,
            totalPoints: data.progress.overall.totalPoints,
            totalMedals: data.progress.overall.totalMedals,
            accessCount: data.progress.overall.accessCount || 0,
            lastAccess: data.lastAccess,
            createdAt: data.createdAt,
            unitStats: {}
        };
        
        // Calcula estatísticas por unidade
        for (let unitId = 1; unitId <= 6; unitId++) {
            const unitProgress = data.progress.units[unitId];
            if (unitProgress) {
                stats.totalQuestions += unitProgress.questionsAnswered;
                stats.totalCorrect += unitProgress.correctAnswers;
                
                if (unitProgress.completed) {
                    stats.unitsCompleted++;
                }
                
                stats.unitStats[unitId] = {
                    accuracy: unitProgress.questionsAnswered > 0 ? 
                        Math.round((unitProgress.correctAnswers / unitProgress.questionsAnswered) * 100) : 0,
                    points: unitProgress.points,
                    stars: unitProgress.stars,
                    completed: unitProgress.completed,
                    progress: unitProgress.progress
                };
            }
        }
        
        // Calcula precisão geral
        stats.averageAccuracy = stats.totalQuestions > 0 ? 
            Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;
        
        return stats;
    }
    
    /**
     * Limpa dados antigos (manutenção)
     */
    cleanupOldData() {
        try {
            // Remove backups antigos (mais de 30 dias)
            const keys = Object.keys(localStorage);
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            
            keys.forEach(key => {
                if (key.startsWith('alfareview_backup_')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data.timestamp && new Date(data.timestamp).getTime() < thirtyDaysAgo) {
                            localStorage.removeItem(key);
                        }
                    } catch (e) {
                        // Remove chaves corrompidas
                        localStorage.removeItem(key);
                    }
                }
            });
            
            return true;
        } catch (error) {
            console.error('Erro na limpeza de dados:', error);
            return false;
        }
    }
    
    /**
     * Verifica integridade dos dados
     */
    checkDataIntegrity() {
        try {
            const data = this.loadData();
            const issues = [];
            
            // Verifica estrutura básica
            if (!data.studentName) issues.push('Nome do estudante ausente');
            if (!data.progress) issues.push('Dados de progresso ausentes');
            if (!data.achievements) issues.push('Dados de conquistas ausentes');
            
            // Verifica progresso das unidades
            for (let unitId = 1; unitId <= 6; unitId++) {
                const unitProgress = data.progress.units[unitId];
                if (unitProgress) {
                    if (unitProgress.correctAnswers > unitProgress.questionsAnswered) {
                        issues.push(`Unidade ${unitId}: Respostas corretas > total de questões`);
                    }
                    if (unitProgress.progress < 0 || unitProgress.progress > 100) {
                        issues.push(`Unidade ${unitId}: Progresso inválido (${unitProgress.progress}%)`);
                    }
                }
            }
            
            return {
                isValid: issues.length === 0,
                issues: issues
            };
        } catch (error) {
            return {
                isValid: false,
                issues: ['Erro ao verificar integridade: ' + error.message]
            };
        }
    }
    
    /**
     * Obtém informações de armazenamento
     */
    getStorageInfo() {
        try {
            const data = JSON.stringify(this.loadData());
            const sizeInBytes = new Blob([data]).size;
            const sizeInKB = Math.round(sizeInBytes / 1024 * 100) / 100;
            
            // Estima espaço disponível (localStorage geralmente tem 5-10MB)
            const estimatedLimit = 5 * 1024; // 5MB em KB
            const usagePercentage = Math.round((sizeInKB / estimatedLimit) * 100);
            
            return {
                sizeInBytes,
                sizeInKB,
                usagePercentage,
                estimatedLimit,
                isNearLimit: usagePercentage > 80
            };
        } catch (error) {
            return {
                error: error.message
            };
        }
    }
    
    /**
     * Sincroniza dados entre abas (usando storage events)
     */
    enableCrossTabSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey && e.newValue) {
                // Dados foram atualizados em outra aba
                const event = new CustomEvent('alfareview:dataUpdated', {
                    detail: JSON.parse(e.newValue)
                });
                window.dispatchEvent(event);
            }
        });
    }
}


// Instância global do gerenciador de armazenamento
window.storageManager = new StorageManager();

