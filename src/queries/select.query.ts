export const SelectQuery = {
    getPlants : 'SELECT PlantID, PlantName FROM RefPlant;',
    getPlant: 'SELECT PlantID, PlantName, SiteName FROM RefPlant WHERE PlantID = :plantId;',
    getRefMaterial: `SELECT
                      -- Heading Block
                      mr.ProtectedMaterialNo,
                      mr.NonProtectedMaterialNo,
                      rm.PlantID,
                      rp.SiteName,
                      rm.MaterialNo,
                      rm.Description,
                      rm.MRPController,
                      lt.OFLeadTimeInWeek,
                      ripm.Variabilty,
                      rm.DaysInventoryOut AS DIO,
                      rm.GoodsReceiptProcessingTime,
                      mr.ScheduleLine2POCount AS SL1,
                      mr.ScheduleLine2SOCount AS SL2,
                      mr.MaterialCategory,

                      -- MasterData 1
                      rm.Technology,
                      rm.LotSize,
                      rm.PlannedDeliveryTime,
                      rm.ABCIndicator,
                      ripm.UsageQty AverageUsage52Weeks,
                      rm.SafetyStock,
                      ssrec.RecSafetyStock,
                      ripm.PlannedQty,
                      ripm.UsageQty,
                      CASE WHEN rm.SafetyStock = 0 AND
                          ssrec.RecSafetyStock = 0 THEN 'OK' WHEN rm.SafetyStock <= ssrec.RecSafetyStock * 0.95 THEN 'ERRLO' WHEN rm.SafetyStock >= ssrec.RecSafetyStock * 1.05 THEN 'ERRHI' WHEN rm.SafetyStock >= ssrec.RecSafetyStock * 0.95 OR
                          rm.SafetyStock <= ssrec.RecSafetyStock * 1.05 THEN 'OK' END AS SSCheck,
                      CASE WHEN ripm.UsageQty <= ripm.PlannedQty * 0.9 THEN 'ERRLO' WHEN ripm.UsageQty >= ripm.PlannedQty * 1.1 THEN 'ERRHI' WHEN ripm.UsageQty >= ripm.PlannedQty * 0.9 OR
                          ripm.UsageQty <= ripm.PlannedQty * 1.1 THEN 'OK' END AS ForecastCheck,
                      rm.MinLotSize,
                      rm.FixedLotSize,
                      rm.RoundingValue,
                      rms.FBMaxBinQty,
                      rms.FBMaxReplQty,
                      ripm.Reliability,
                      ripm.ForwardConsumptionPeriod,

                      rm.MaterialPlanningLotSize,
                      rm.MaterialStatus,
                      rm.CrossPlantMaterialStatus,
                      rm.MRPType,
                      rm.PurchasingGroup,
                      rm.BaseUnit,
                      rm.AutomaticPO,
                      rm.PlanningCalendar,
                      rm.DeletionFlag,
                      rm.SelectionMethod,
                      rm.DependentRequirmentIndicator,
                      rm.AssemblyScrapPercent,
                      rm.AvailabilityCheck,
                      rm.DiscontinuationIndicator,
                      rm.EffectiveOutDate,
                      rm.FollowUpMaterial,
                      rm.CoverageProfile,
                      rm.MixedMRPIndicator,
                      rm.ForecastModel,
                      rm.PeriodIndicator,
                      rm.QuotaArrangementUsage,
                      rm.SplitIndicator,
                      rm.SpecialProcurement,
                      rm.PlannedDeliveryTime,
                      rm.InHouseProductionTime,
                      rm.SchedulingMarginKey,
                      rm.ProductionStorageLocation,
                      rm.StorageLocationforEP,
                      rm.SetupTime,
                      rm.InteroperationTime,
                      rm.ProcessingTime,
                      rm.IssueUnit,
                      rm.ProductionUnit,
                      rm.OrderUnit,
                      rm.MRPGroup,
                      rm.MaxLotSize,
                      rm.RoundingProfile,
                      rm.MaxStockLevel,
                      rm.TaktTime,
                      rm.PlanningTime,
                      rm.ReorderPoint,
                      rm.PlanningCycle,
                      rm.MaterialGroup,
                      rm.MaterialType,
                      rm.LowLevelcode,
                      ripm.IPTechnology,
                      ripm.VariabilityIncludingSales,
                      rm.MaterialStatusValidFrom,
                      rm.ConfigurableMaterial,
                      rm.PlanningStrategyGroup,
                      rm.StorageCostsIndicator

                    FROM  RefMaterial rm
                    LEFT JOIN   MaterialLeadTime lt
                                ON (rm.PlantID = lt.PlantID AND rm.MaterialNo = lt.MaterialNo)
                                LEFT JOIN
    RefPlant rp ON (rm.PlantID = rp.PlantID)
                    LEFT JOIN   MRPAnalysis mr
                                ON (rm.PlantID = mr.PlantID AND rm.MaterialNo = mr.MaterialNo)
                    LEFT JOIN   (SELECT PlantID,
                                        MaterialNo,
                                        TRLeadTime,
                                        IPTechnology,
                                        Variabilty,
                                        VariabilityIncludingSales,
                                        PlannedQty,
                                        Reliability,
                                        ForwardConsumptionPeriod,
                                        (IFNULL(TotalUsageWeek1_13, 0) + IFNULL(TotalUsageWeek14_26, 0)) / 25 AS UsageQty
                                FROM    RefIPMaterial) ripm
                                    ON  (rm.PlantID = ripm.PlantID AND rm.MaterialNo = ripm.MaterialNo)
                    LEFT JOIN   (SELECT RecCal.MaterialNo,
                          RecCal.PlantID,
                          RecCal.PlannedDeliveryTime,
                          CASE WHEN RecSafetyStock0 > 0 AND
                              RecSafetyStock0 < 0.01 THEN 0.01 ELSE RecSafetyStock0 END AS RecSafetyStock
                        FROM (SELECT
                            rm.MaterialNo,
                            rm.PlantID,
                            '' PlannedDeliveryTime,
                            0 RecSafetyStock0
                          FROM RefMaterial rm
                            LEFT JOIN RefIPMaterial ripm
                              ON (rm.PlantID = ripm.PlantID
                              AND rm.MaterialNo = ripm.MaterialNo)
                          WHERE rm.PlantID = :PlantID
                          AND rm.MaterialNo = :MaterialNo) AS RecCal) AS ssrec
                        ON (rm.MaterialNo = ssrec.MaterialNo
                        AND rm.PlantID = ssrec.PlantID)
                      LEFT JOIN (SELECT
                          PlantID,
                          MaterialNo,
                          MAX(MaxStorageBinQuantity) AS FBMaxBinQty,
                          MAX(ReplenishmentQuantity) AS FBMaxReplQty,
                          COUNT(MaterialNo) AS MatCount
                        FROM (SELECT
                            ms.*,
                            mq.PlantID
                          FROM RefMaterialStorage ms
                            JOIN RefQuantsInfo mq
                              ON (ms.MaterialNo = mq.MaterialNo
                              AND ms.WarehouseNo = mq.WarehouseNo)
                          WHERE mq.PlantID = :PlantID
                          AND ms.MaterialNo = :MaterialNo) t1
                        GROUP BY PlantID,
                                MaterialNo) rms
                        ON (rm.MaterialNo = rms.MaterialNo
                        AND rm.PlantID = rms.PlantID)
                    WHERE rm.PlantID = :PlantID
                    AND rm.MaterialNo = :MaterialNo;`,
getRefMaterialValuation: `SELECT MaterialNo, ValuationArea, ValuationType, ValuationClass, AveragePrice, StandardPrice,PriceUnit, PriceControlFlag FROM RefMaterialValuation where ValuationArea = :PlantID and MaterialNo = :MaterialNo;`,
getBatchTextGeneratorConfig: `SELECT Config.ConfigCode, Config.Type, Config.Params, Config.Parent
                                from ConfigurationInfo as Config
                                WHERE Config.ConfigCode = 'BATCH-TXT-DDL' AND Config.ActiveFlg = 'Y' AND ifnull(Config.Parent,'') = :filterParent;`,
getBlockStockOverview: `SELECT PlantID,
                        Case when PreAction IS NULL then 'TOTAL'
                          when PreAction = 'Destroy' then 'PotProvision' else PreAction end AS ActionType,
                        COUNT(DISTINCT MaterialNo) as MatCount,
                        COUNT(DISTINCT BatchNo) as BatCount,
                        Round(SUM(BlockedQuantity),2) as BlockedQty,
                        SUM(BlockValue) as BlockedVal,
                        Round(AVG(BlendPercentage),2) as AvgBlendRate,
                        COUNT(DISTINCT Case when PreAction = 'ReturnToVendor' then BatchNo
                          when PreAction NOT in ('Destroy','Des-POCO','InvDisc','Undecided') AND OneMonthUsage <> 0 then
                          BatchNo end) as MonthOne,
                        IFNULL(SUM(Case when PreAction = 'ReturnToVendor' then BlockValue
                          when PreAction NOT in ('Destroy','Des-POCO','InvDisc','Undecided') AND OneMonthUsage <> 0 then
                          OneMonthUsage * OneKGValue end),0) as MonthOneVal,
                        COUNT(DISTINCT Case when PreAction NOT in ('Destroy','Des-POCO','InvDisc','Undecided','ReturnToVendor')
                          AND OneQuarterUsage <> 0 then BatchNo end) as QtrOne,
                        IFNULL(SUM(Case when PreAction NOT in ('Destroy','Des-POCO','InvDisc','Undecided','ReturnToVendor')
                          AND OneQuarterUsage <> 0 then OneQuarterUsage * OneKGValue end),0) as QtrOneVal,
                        COUNT(DISTINCT Case when PreAction NOT in ('Destroy','Des-POCO','InvDisc','Undecided','ReturnToVendor')
                          AND HalfYearUsage <> 0 then BatchNo end) as HalfYear,
                        IFNULL(SUM(Case when PreAction NOT in ('Destroy','Des-POCO','InvDisc','Undecided','ReturnToVendor')
                          AND HalfYearUsage <> 0 then HalfYearUsage * OneKGValue end),0) as HalfYearVal,
                        Count(DISTINCT Case when (PreAction NOT in ('Destroy','Des-POCO','InvDisc','Undecided')
                          AND OneYearUsage <> 0) OR PreAction = 'ReturnToVendor' then BatchNo end) as YearOne,
                        IFNULL(SUM(Case when PreAction = 'ReturnToVendor' then BlockValue
                          when PreAction NOT in ('Destroy','Des-POCO','InvDisc','Undecided') AND OneYearUsage <> 0
                          then OneYearUsage * OneKGValue end),0) as YearOneVal,
                        COUNT(DISTINCT Case when PreAction in ('Destroy','Des-POCO','InvDisc','Undecided') OR
                          (PreAction <> 'ReturnToVendor' AND OverYearUsage <> 0) then BatchNo end) as OverYearOne,
                        IFNULL(SUM(Case when PreAction NOT in ('Destroy','Des-POCO','InvDisc','Undecided','ReturnToVendor')
                          AND OverYearUsage <> 0 then OverYearUsage * OneKGValue when PreAction
                          in ('Destroy','Des-POCO','InvDisc','Undecided')then BlockValue end),0) as OverYearOneVal
                        from CMP_BlockStock
                        where PlantID=:plantId
                        Group by PreAction
                        with rollup;`,
  getBlockStockBatches: `SELECT * FROM CMP_BlockStock where PlantID=:plantId WhereBlock `
}

  
  

  
}
