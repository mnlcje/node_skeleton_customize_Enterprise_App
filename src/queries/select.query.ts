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
  getBlockStockBatches: `SELECT * FROM CMP_BlockStock where PlantID=:plantId WhereBlock;`,
    
  getPlantEquipmentDescription:
    `SELECT Plnt.PlantID, ProOrdInf.EquipmentType, ci.Params AS name FROM RefProcessOrderInfo AS ProOrdInf
        INNER JOIN  ConfigurationInfo AS ci ON ProOrdInf.EquipmentType = ci.Type AND ci.ConfigCode = 'TECH-DESC'
        INNER JOIN RefPlant AS Plnt ON ProOrdInf.PlantID = Plnt.PlantID
          AND ProOrdInf.EquipmentType IS NOT NULL
          AND Plnt.PlantType = 'M'
        GROUP BY Plnt.PlantID,ProOrdInf.EquipmentType, ci.Params
        ORDER BY ProOrdInf.EquipmentType;`,
  getFGPOverviewTableData:
    `SELECT ecr.IsPrimary, ec.RuleType, CONVERT(OVInfo.FinishDate, CHAR) as finDate, OVInfo.EquipmentType, OVInfo.TechnologyType, OVInfo.Demand, OVInfo.Confirmed,
          OVInfo.PartiallyConfirmed, OVInfo.ToBeCompleted, OVInfo.ProjectedBackLog, OVInfo.AvailableCapacity, OVInfo.Released,
          OVInfo.Created, OV.RescheduledMissingPart, OV.SubCreateMissingPart, OV.ReviewMissingPart, OV.MTBAMissingPart,
          OV.MaterialAvailability, OV.MaterialAvailabilityCommitted, OV.MaterialAvailabilitySub, OV.MaterialAvailabilityRM,
          OV.MaterialAvailabilityBlend, OV.MaterialAvailabilityNotChecked, OV.Phases, OV.RescheduledOrder, OV.ScheduledLine2Order
        FROM FGP_OverviewItemInfo AS OVInfo
        INNER JOIN FGP_OverviewInfo AS OV
        ON OV.PlantID = OVInfo.PlantID
          AND OV.EquipmentType = OVInfo.EquipmentType
          AND OV.FinishDate = OVInfo.FinishDate
          LEFT JOIN FGP_EquipmentConfiguration AS ec
          ON OV.PlantID = ec.PlantId
            AND OV.EquipmentType = ec.EquipmentType
            AND OVInfo.TechnologyType = ec.Breakdown
          LEFT JOIN FGP_EquipmentConfigurationRuleType AS ecr
          ON ec.PlantID = ecr.PlantID
            AND ec.RuleType = ecr.RuleType
        WHERE OV.PlantID = :plantID
          AND OVInfo.TechnologyType <> ''
          AND OVInfo.EquipmentType = :equipmentType
        GROUP BY OVInfo.FinishDate, OVInfo.EquipmentType, OVInfo.TechnologyType`,
  getPRODetails:
    `SELECT DISTINCT ('test') AS Comment, PO.ProcessOrderNo, PO.MaterialNo, PO.Description, PO.MRPController, VPO.EquipmentType,
            VPO.Breakdown, PO.Status, PO.FinalStatus, PO.TargetQuantity, PO.CreatedAt, PO.BasicStartDate,
            PO.BasicFinishDate, PO.ActualStartDate, PO.ActualReleaseDate, PO.ActualFinishDate, PO.PlannerGroup AS Ptype, PO.CharacteristicValue AS koshar,
            MT.RMDelivDate, MT.MTBAStat, MT.MTBAStatTxt, DT.SaleOrderNo, DT.MaterialAvailDate, DT.frGIDate,
            DT.delivGIDate, DT.GIDate, DT.SchLineNo, CMS.MSPTCount,
            CASE
              WHEN PO.FinalStatus IN ('DLFL') THEN 7
              WHEN PO.FinalStatus IN ('CNF', 'DLV', 'TECO') THEN 6
              WHEN PO.FinalStatus IN ('PCNF') THEN 1
              WHEN PO.FinalStatus IN ('REL') THEN 2
              WHEN PO.FinalStatus IN ('MSPT') THEN 3
              WHEN PO.FinalStatus IN ('MACM') THEN 4
              WHEN PO.FinalStatus IN ('MANC') THEN 5
            END AS Class
          FROM ACT_ProcessOrderInfo AS PO
          INNER JOIN View_Processorderbreakdown AS VPO
            ON VPO.ProcessOrderNo = PO.ProcessOrderNo
            AND VPO.EquipmentType = :equipmentType
            INNER JOIN FGP_OverviewItemInfo AS fpover
            ON PO.PlantID = fpover.PlantID
            AND fpover.EquipmentType = :equipmentType
            AND PO.BasicFinishDate = fpover.FinishDate
          LEFT JOIN (SELECT
              CDS.PONumber,
              SO.PlantID,
              GROUP_CONCAT(CONCAT(SO.SalesOrderNo,'-',CDS.SalesOrderItemNo)) AS SaleOrderNo,
              MIN(SO.MaterialAvailabilityDate) AS MaterialAvailDate,
              MIN(SO.GoodsIssueDate) AS GIDate,
              MAX(SO.ScheduleLineNo) AS SchLineNo,
              MIN(SO.PlannedGoodsIssueDate2) AS frGIDate,
              MIN(SO.GoodsIssueDate2) AS delivGIDate
            FROM RefSalesOrderInfo AS SO
              INNER JOIN CMT_DocumentStatus AS CDS
                ON CDS.SalesOrderNo = SO.SalesOrderNo
                AND CDS.SalesOrderItemNo = SO.SalesOrderItemNo
            WHERE SO.PlantID = :plantId
            AND SO.QuantityBaseUnit <> 0
            GROUP BY CDS.PONumber) AS DT
            ON PO.ProcessOrderNo = DT.PONumber
          LEFT JOIN fn_OF_PPPOMTBA AS MT
            ON PO.ProcessOrderNo = MT.ProcessOrderNo
          LEFT JOIN (SELECT
              ProcessOrderNo,
              COUNT(MissingPart) AS MSPTCount
            FROM ACT_ProcessOrderItem
            WHERE MissingPart = 'X'
            AND PlantID = :plantId
            GROUP BY ProcessOrderNo) AS CMS
            ON CMS.ProcessOrderNo = PO.ProcessOrderNo
        WHERE PO.PlantID = :plantId '
  
}

  
  

  
}
